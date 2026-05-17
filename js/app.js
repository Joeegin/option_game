/**
 * Main Application
 * Ties together all modules and manages the game loop.
 */
class App {
  constructor() {
    this.game = new Game();
    this.ui = new UI();
    this.market = null;
    this.portfolio = null;
    this.chart = null;
    this.tradeMarkers = [];

    this._setupUICallbacks();
    this._setupKeyboardShortcuts();
    this._showLevelSelect();
  }

  _setupUICallbacks() {
    this.ui.onSelectLevel = (levelId) => this._startLevel(levelId);
    this.ui.onStartLevel = () => this._activateTrading();
    this.ui.onAdvanceDay = () => this._advanceDay();
    this.ui.onAdvanceDays = (n) => this._advanceDays(n);
    this.ui.onTrade = (tradeConfig) => this._executeTrade(tradeConfig);
    this.ui.onClosePosition = (positionId) => this._closePosition(positionId);
    this.ui.onResetGame = () => this._resetGame();
    this.ui.onSkipOnboarding = () => this._showLevelSelect();
    this.ui.onFinishOnboarding = () => this._startLevel(1);
    this.ui.onRedrawChart = () => {
      // Defer one tick to let CSS finish revealing the pane
      setTimeout(() => this._updateChart(), 30);
    };
  }

  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        this.ui.closeActiveModal();
        return;
      }

      if (this.game.getState() !== 'playing') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this._advanceDay();
      } else if (e.key >= '1' && e.key <= '9') {
        const input = document.getElementById('trade-qty');
        if (input) input.value = e.key;
      }
    });
  }

  _showLevelSelect() {
    this.game.resetLevel();
    // First-time visitors auto-enter onboarding; returning visitors see level list
    if (typeof Onboarding !== 'undefined' && !Onboarding.isCompleted() && this.game.getProgress().completed === 0) {
      this.ui.renderOnboarding(0);
    } else {
      this.ui.renderLevelSelect(LEVEL_DEFINITIONS, this.game);
    }
  }

  _startLevel(levelId) {
    if (!this.game.loadLevel(levelId)) {
      this.ui.showToast('无法加载此关卡', 'error');
      return;
    }
    this._beginPlaying();
  }

  _beginPlaying() {
    const level = this.game.currentLevel;

    this.market = new Market({
      initialPrice: level.initialPrice,
      volatility: level.volatility,
      totalDays: level.totalDays,
      drift: level.drift,
      riskFreeRate: 0.03,
    });

    this.portfolio = new Portfolio(level.initialCash);
    this.tradeMarkers = [];

    this.ui.renderGame(level, this.market, this.portfolio, this.game);

    setTimeout(() => {
      this.chart = new PriceChart('price-chart');
      this._updateChart();
    }, 150);
  }

  _activateTrading() {
    this.game.startPlaying();
    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);
    setTimeout(() => this._updateChart(), 50);
  }

  _executeTrade(tradeConfig) {
    if (this.game.getState() !== 'playing') {
      this.ui.showToast('当前无法交易', 'error');
      return;
    }

    const level = this.game.currentLevel;
    const { type, isLong, strike, quantity, isStock } = tradeConfig;

    const actionKey = isStock
      ? (isLong ? 'buy_stock' : 'sell_stock')
      : `${isLong ? 'buy' : 'sell'}_${type}`;
    if (!level.allowedActions.includes(actionKey)) {
      this.ui.showToast('此关卡不允许该操作', 'error');
      return;
    }

    let premium;
    if (isStock) {
      const q = this.market.getStockQuote();
      premium = isLong ? q.ask : q.bid;
    } else {
      const price = this.market.getOptionPrice(type, strike);
      premium = isLong ? price.ask : price.bid;
    }

    const option = {
      type,
      strike,
      isLong,
      openDay: this.market.getDay(),
      openPrice: this.market.getCurrentPrice(),
    };

    const result = this.portfolio.openPosition(
      option, quantity, premium, isStock, this.market.getCurrentPrice()
    );
    if (!result.success) {
      this.ui.showToast(result.error, 'error');
      return;
    }

    this.tradeMarkers.push({
      day: this.market.getDay(),
      price: this.market.getCurrentPrice(),
      type: isLong ? 'buy' : 'sell',
      label: isStock
        ? (isLong ? 'Buy Stock' : 'Sell Stock')
        : `${isLong ? 'Buy' : 'Sell'} ${type.toUpperCase()} $${strike}`,
    });

    const actionLabel = isStock
      ? (isLong ? '买入股票' : '卖出股票')
      : `${isLong ? '买入' : '卖出'} ${type === 'call' ? 'Call' : 'Put'} @ $${strike}`;

    this.ui.showToast(`${actionLabel} x${quantity}  @ $${premium.toFixed(2)}`, 'success');
    this.ui.updateDashboard(level, this.market, this.portfolio, this.game);
    this._updateChart();
  }

  _closePosition(positionId) {
    if (this.game.getState() !== 'playing') return;

    const pos = this.portfolio.getPositions().find(p => p.id === positionId);
    if (!pos) return;

    let currentPremium;
    if (pos.isStock) {
      const q = this.market.getStockQuote();
      currentPremium = pos.isLong ? q.bid : q.ask;
    } else {
      const price = this.market.getOptionPrice(pos.optionType, pos.strike);
      currentPremium = pos.isLong ? price.bid : price.ask;
    }

    const result = this.portfolio.closePosition(positionId, currentPremium);
    if (!result.success) {
      this.ui.showToast(result.error, 'error');
      return;
    }

    this.tradeMarkers.push({
      day: this.market.getDay(),
      price: this.market.getCurrentPrice(),
      type: pos.isLong ? 'sell' : 'buy',
      label: `Close ${pos.optionType || 'STOCK'}`,
    });

    const pnlText = result.pnl >= 0 ? `+$${result.pnl.toFixed(2)}` : `-$${Math.abs(result.pnl).toFixed(2)}`;
    this.ui.showToast(`平仓成功 ${pnlText}`, result.pnl >= 0 ? 'success' : 'error');

    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);
    this._updateChart();
    this._checkGameEnd();
  }

  _advanceDay() {
    if (this.game.getState() !== 'playing') return;

    const newPrice = this.market.advanceDay();
    if (newPrice === null) {
      this.ui.showToast('已是最后一天', 'info');
      this._checkGameEnd();
      return;
    }

    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);
    this._updateChart();
    this._checkGameEnd();
  }

  _advanceDays(n) {
    if (this.game.getState() !== 'playing') return;
    const remaining = this.market.getDaysRemaining();
    const steps = Math.min(n, remaining);
    for (let i = 0; i < steps; i++) {
      if (this.market.advanceDay() === null) break;
    }
    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);
    this._updateChart();
    this._checkGameEnd();
  }

  _checkGameEnd() {
    const getPrice = (pos) => {
      if (pos.isStock) return this.market.getCurrentPrice();
      return this.market.getOptionPrice(pos.optionType, pos.strike).mid;
    };

    const pnl = this.portfolio.getTotalPnL(getPrice);
    const portValue = this.portfolio.getPortfolioValue(getPrice);
    const result = this.game.checkConditions(
      pnl, portValue, this.market.getDay(), this.market.getTotalDays(), this.portfolio
    );

    if (result === 'won' || result === 'lost') {
      const level = this.game.currentLevel;
      const extra = result === 'lost' ? { suggestion: this._buildLossSuggestion(level, pnl) } : null;
      this.ui.showResult(
        result, level, pnl,
        () => {
          if (level.id < LEVEL_DEFINITIONS.length) {
            this._startLevel(level.id + 1);
          } else {
            this._showLevelSelect();
          }
        },
        () => {
          this.game.resetLevel();
          this._beginPlaying();
        },
        () => this._showLevelSelect(),
        extra
      );
    }
  }

  _buildLossSuggestion(level, pnl) {
    const stats = this.market.getStats();
    const trend = stats.changePct;
    const summary = this.portfolio.getPositionSummary();
    const tips = [];

    if (level.id === 1 && trend > 0 && summary.longCalls === 0) {
      tips.push('💡 股价上涨了，但你没有买 Call。下次尝试在前几天买入 ATM 或略 OTM Call。');
    } else if (level.id === 2 && trend < 0 && summary.longPuts === 0) {
      tips.push('💡 股价下跌了，但你没有买 Put。这正是 Put 的用武之地。');
    } else if (level.id === 4 && summary.shortCalls === 0) {
      tips.push('💡 Covered Call 需要持股 + 卖出 Call。光持股没有用上权利金收入。');
    } else if (level.id === 5 && summary.longPuts === 0) {
      tips.push('💡 Protective Put 关键在"保护"——必须买入 Put 才能限制下行。');
    } else if (level.id === 8) {
      tips.push('💡 Straddle 需要足够波动才能盈利。如果股价没动，两份权利金会一起亏损。');
    }

    if (Math.abs(pnl) < 30) {
      tips.push('当前盈亏接近零——可能进场太晚或仓位太小，尝试早点建仓。');
    }
    if (trend > 5 && summary.longPuts > 0) {
      tips.push('股价上涨 ' + trend.toFixed(1) + '%，但你持有 Put（看跌），方向反了。');
    }
    if (trend < -5 && summary.longCalls > 0) {
      tips.push('股价下跌 ' + trend.toFixed(1) + '%，但你持有 Call（看涨），方向反了。');
    }

    return tips.length ? tips.map(t => `<div>${t}</div>`).join('') : '建议：重新阅读教程，思考策略与市场走势的匹配。';
  }

  _updateChart() {
    if (!this.chart || !this.market) return;
    if (this.chart.canvas.width === 0 || this.chart.canvas.height === 0) {
      this.chart._resize();
    }
    this.chart.draw(this.market.getPriceHistory(), this.tradeMarkers);
  }

  _resetGame() {
    this.game.resetAll();
    this._showLevelSelect();
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  window.app = app;
  window.ui = app.ui;
});
