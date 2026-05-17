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
    this._showLevelSelect();
  }

  _setupUICallbacks() {
    this.ui.onSelectLevel = (levelId) => this._startLevel(levelId);
    this.ui.onStartLevel = () => this._activateTrading();
    this.ui.onAdvanceDay = () => this._advanceDay();
    this.ui.onTrade = (tradeConfig) => this._executeTrade(tradeConfig);
    this.ui.onClosePosition = (positionId) => this._closePosition(positionId);
    this.ui.onResetGame = () => this._resetGame();
  }

  _showLevelSelect() {
    this.game.resetLevel();
    this.ui.renderLevelSelect(LEVEL_DEFINITIONS, this.game);
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
    // Don't start game yet — user reads tutorial first

    // Initialize market
    this.market = new Market({
      initialPrice: level.initialPrice,
      volatility: level.volatility,
      totalDays: level.totalDays,
      drift: level.drift,
      riskFreeRate: 0.03,
    });

    // Initialize portfolio
    this.portfolio = new Portfolio(level.initialCash);
    this.tradeMarkers = [];

    // Render game with tutorial in middle area
    this.ui.renderGame(level, this.market, this.portfolio, this.game);

    // Initialize chart immediately (shows starting price while user reads)
    setTimeout(() => {
      this.chart = new PriceChart('price-chart');
      this._updateChart();
    }, 150);
  }

  /** Called when user clicks "开始交易" after reading tutorial */
  _activateTrading() {
    this.game.startPlaying();

    // Update knowledge panel to show strategy guide
    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);

    // Redraw chart (may need resize after layout change)
    setTimeout(() => this._updateChart(), 50);
  }

  _executeTrade(tradeConfig) {
    if (this.game.getState() !== 'playing') {
      this.ui.showToast('当前无法交易', 'error');
      return;
    }

    const level = this.game.currentLevel;
    const { type, isLong, strike, quantity, isStock } = tradeConfig;

    // Check if action is allowed
    if (!isStock) {
      const actionKey = `${isLong ? 'buy' : 'sell'}_${type}`;
      if (!level.allowedActions.includes(actionKey)) {
        this.ui.showToast('此关卡不允许该操作', 'error');
        return;
      }
    } else {
      const actionKey = `${isLong ? 'buy' : 'sell'}_stock`;
      if (!level.allowedActions.includes(actionKey)) {
        this.ui.showToast('此关卡不允许该操作', 'error');
        return;
      }
    }

    // Get premium
    let premium;
    if (isStock) {
      premium = this.market.getCurrentPrice();
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

    const result = this.portfolio.openPosition(option, quantity, premium, isStock);
    if (!result.success) {
      this.ui.showToast(result.error, 'error');
      return;
    }

    // Record trade marker
    this.tradeMarkers.push({
      day: this.market.getDay(),
      price: this.market.getCurrentPrice(),
      type: isLong ? 'buy' : 'sell',
      label: isStock ? (isLong ? 'Buy Stock' : 'Sell Stock') : `${isLong ? 'Buy' : 'Sell'} ${type.toUpperCase()} $${strike}`,
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
      currentPremium = this.market.getCurrentPrice();
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
      return;
    }

    this.ui.updateDashboard(this.game.currentLevel, this.market, this.portfolio, this.game);
    this._updateChart();

    // Auto-check conditions
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
      this.ui.showResult(
        result, level, pnl,
        () => {
          // Next level
          if (level.id < LEVEL_DEFINITIONS.length) {
            this._startLevel(level.id + 1);
          } else {
            this._showLevelSelect();
          }
        },
        () => {
          // Retry
          this.game.resetLevel();
          this._beginPlaying();
        },
        () => {
          // Back to list
          this._showLevelSelect();
        }
      );
    }
  }

  _updateChart() {
    if (!this.chart || !this.market) return;
    // Ensure canvas is sized before drawing
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

// Boot the app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  window.ui = app.ui; // expose for onclick handlers
});
