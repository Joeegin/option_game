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
   * Open a new position
   * @param {object} option - { type: 'call'|'put', strike, optionType, isLong: bool }
   * @param {number} quantity - Number of contracts (each = 100 shares)
   * @param {number} premium - Price paid/received per share
   * @param {boolean} isStock - Whether this is a stock position
   */
  openPosition(option, quantity, premium, isStock = false) {
    const cost = premium * quantity * (isStock ? 1 : 100);
    const isLong = option.isLong !== false; // default to long

    // For long positions: pay premium (cost), for short: receive premium
    const cashFlow = isLong ? -cost : cost;

    if (this.cash + cashFlow < 0) {
      return { success: false, error: '资金不足' };
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
    };

    this.positions.push(position);
    return { success: true, position };
  }

  /**
   * Close an existing position
   * @param {number} positionId
   * @param {number} currentPremium - Current market premium for the option/stock
   */
  closePosition(positionId, currentPremium) {
    const idx = this.positions.findIndex(p => p.id === positionId);
    if (idx === -1) return { success: false, error: '找不到持仓' };

    const pos = this.positions[idx];
    const multiplier = pos.isStock ? 1 : 100;

    // Close the position: reverse the cash flow from opening
    // Long: we bought at entry, now sell at current → receive currentPremium
    // Short: we sold at entry, now buy back at current → pay currentPremium
    if (pos.isLong) {
      this.cash += currentPremium * pos.quantity * multiplier;
    } else {
      this.cash -= currentPremium * pos.quantity * multiplier;
    }

    // Calculate P&L
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

  /**
   * Get mark-to-market P&L for all open positions
   * @param {function} getCurrentPrice - fn(type, strike) => {bid, ask, mid}
   */
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

  /** Total realized P&L from closed positions */
  getRealizedPnL() {
    return this.closedPositions.reduce((sum, p) => sum + p.pnl, 0);
  }

  /** Total P&L = realized + unrealized */
  getTotalPnL(getCurrentPrice) {
    return this.getRealizedPnL() + this.getUnrealizedPnL(getCurrentPrice);
  }

  /** Portfolio value = cash + unrealized value */
  getPortfolioValue(getCurrentPrice) {
    return this.cash + this.getUnrealizedPnL(getCurrentPrice);
  }

  getPositions() {
    return [...this.positions];
  }

  getCash() {
    return this.cash;
  }

  /** Count positions by type for level validation */
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
