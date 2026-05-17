/**
 * Portfolio Manager
 * Tracks positions, cash, and calculates P&L.
 */
class Portfolio {
  constructor(initialCash = 10000) {
    this.initialCash = initialCash;
    this.cash = initialCash;
    this.positions = [];
    this.closedPositions = [];
    this.nextId = 1;
  }

  /**
   * Required margin for a naked short option (simplified CBOE-like rule).
   * Naked call: 20% * underlying + premium - OTM amount (floor: 10% * underlying)
   * Naked put : 20% * underlying + premium - OTM amount (floor: 10% * strike)
   */
  _calcShortMargin(option, premium, underlyingPrice) {
    if (option.type === 'call') {
      const otm = Math.max(0, option.strike - underlyingPrice);
      const standard = (0.20 * underlyingPrice + premium - otm) * 100;
      const floor = (0.10 * underlyingPrice + premium) * 100;
      return Math.max(standard, floor);
    } else {
      const otm = Math.max(0, underlyingPrice - option.strike);
      const standard = (0.20 * underlyingPrice + premium - otm) * 100;
      const floor = (0.10 * option.strike + premium) * 100;
      return Math.max(standard, floor);
    }
  }

  openPosition(option, quantity, premium, isStock = false, underlyingPrice = null) {
    const isLong = option.isLong !== false;
    const multiplier = isStock ? 1 : 100;
    const cost = premium * quantity * multiplier;

    // Cash flow at open
    const cashFlow = isLong ? -cost : cost;

    // Margin requirement for naked short options
    let marginHeld = 0;
    if (!isLong && !isStock && underlyingPrice != null) {
      marginHeld = this._calcShortMargin(option, premium, underlyingPrice) * quantity;
    }

    if (this.cash + cashFlow - marginHeld < 0) {
      return {
        success: false,
        error: marginHeld > 0
          ? `资金不足：裸卖需冻结保证金 $${marginHeld.toFixed(0)}`
          : '资金不足',
      };
    }

    this.cash += cashFlow;

    const position = {
      id: this.nextId++,
      optionType: option.type,
      strike: option.strike,
      quantity,
      entryPremium: premium,
      isLong,
      isStock,
      openDay: option.openDay || 0,
      openPrice: option.openPrice || 0,
      marginHeld,
    };

    if (marginHeld > 0) this.cash -= marginHeld;

    this.positions.push(position);
    return { success: true, position };
  }

  closePosition(positionId, currentPremium) {
    const idx = this.positions.findIndex(p => p.id === positionId);
    if (idx === -1) return { success: false, error: '找不到持仓' };

    const pos = this.positions[idx];
    const multiplier = pos.isStock ? 1 : 100;

    if (pos.isLong) {
      this.cash += currentPremium * pos.quantity * multiplier;
    } else {
      this.cash -= currentPremium * pos.quantity * multiplier;
    }

    if (pos.marginHeld) {
      this.cash += pos.marginHeld;
    }

    let pnl;
    if (pos.isLong) {
      pnl = (currentPremium - pos.entryPremium) * pos.quantity * multiplier;
    } else {
      pnl = (pos.entryPremium - currentPremium) * pos.quantity * multiplier;
    }

    this.positions.splice(idx, 1);
    this.closedPositions.push({ ...pos, closePremium: currentPremium, pnl });

    return { success: true, pnl, position: pos };
  }

  getUnrealizedPnL(getCurrentPrice) {
    let totalPnl = 0;
    for (const pos of this.positions) {
      const price = getCurrentPrice(pos);
      const multiplier = pos.isStock ? 1 : 100;
      if (pos.isLong) {
        totalPnl += (price - pos.entryPremium) * pos.quantity * multiplier;
      } else {
        totalPnl += (pos.entryPremium - price) * pos.quantity * multiplier;
      }
    }
    return totalPnl;
  }

  getRealizedPnL() {
    return this.closedPositions.reduce((sum, p) => sum + p.pnl, 0);
  }

  getTotalPnL(getCurrentPrice) {
    return this.getRealizedPnL() + this.getUnrealizedPnL(getCurrentPrice);
  }

  getPortfolioValue(getCurrentPrice) {
    const marginLocked = this.positions.reduce((s, p) => s + (p.marginHeld || 0), 0);
    return this.cash + marginLocked + this.getUnrealizedPnL(getCurrentPrice);
  }

  getPositions() {
    return [...this.positions];
  }

  getClosedPositions() {
    return [...this.closedPositions];
  }

  getCash() {
    return this.cash;
  }

  getPositionSummary() {
    const summary = { longCalls: 0, shortCalls: 0, longPuts: 0, shortPuts: 0, longStock: 0, shortStock: 0 };
    for (const pos of this.positions) {
      if (pos.isStock) {
        summary[pos.isLong ? 'longStock' : 'shortStock'] += pos.quantity;
      } else if (pos.optionType === 'call') {
        summary[pos.isLong ? 'longCalls' : 'shortCalls'] += pos.quantity;
      } else if (pos.optionType === 'put') {
        summary[pos.isLong ? 'longPuts' : 'shortPuts'] += pos.quantity;
      }
    }
    return summary;
  }

  reset(initialCash) {
    this.cash = initialCash || this.initialCash;
    this.positions = [];
    this.closedPositions = [];
  }
}
