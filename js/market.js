/**
 * Market Simulator
 * Generates price paths and simulates market data for the game.
 */
class Market {
  constructor(config = {}) {
    this.initialPrice = config.initialPrice ?? 100;
    this.volatility = config.volatility ?? 0.30; // annualized
    this.riskFreeRate = config.riskFreeRate ?? 0.03;
    this.drift = config.drift ?? 0.05; // slight upward drift for stock

    this.currentDay = 0;
    this.totalDays = config.totalDays ?? 30;
    this.priceHistory = [this.initialPrice];
    this.currentPrice = this.initialPrice;

    // Pre-generate the price path using geometric Brownian motion
    this._generatePath();
  }

  _generatePath() {
    this.priceHistory = [this.initialPrice];
    const dt = 1 / 252; // daily steps
    const dailyVol = this.volatility * Math.sqrt(dt);
    const dailyDrift = (this.drift - 0.5 * this.volatility * this.volatility) * dt;

    for (let i = 1; i <= this.totalDays; i++) {
      const random = this._boxMuller();
      const prevPrice = this.priceHistory[i - 1];
      const newPrice = prevPrice * Math.exp(dailyDrift + dailyVol * random);
      // Clamp to reasonable range
      this.priceHistory.push(Math.max(5, Math.min(300, newPrice)));
    }
  }

  // Box-Muller transform for normal random numbers
  _boxMuller() {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  }

  /** Advance to the next trading day. Returns the new price. */
  advanceDay() {
    if (this.currentDay >= this.totalDays) return null;
    this.currentDay++;
    this.currentPrice = this.priceHistory[this.currentDay];
    return this.currentPrice;
  }

  getCurrentPrice() {
    return this.currentPrice;
  }

  getPriceHistory() {
    return this.priceHistory.slice(0, this.currentDay + 1);
  }

  getDaysRemaining() {
    return this.totalDays - this.currentDay;
  }

  getDay() {
    return this.currentDay;
  }

  getTotalDays() {
    return this.totalDays;
  }

  /**
   * Build an options chain for the current market state.
   * Generates quotes for a range of strikes around the current price.
   */
  getOptionsChain() {
    const S = this.currentPrice;
    const daysLeft = this.getDaysRemaining();
    const T = Math.max(daysLeft / 365, 0.005); // at least ~2 days in years
    const r = this.riskFreeRate;
    const sigma = this.volatility;

    // Adaptive strike step: ~2.5% of underlying, snapped to a clean grid
    const step = this._strikeStep(S);
    const baseStrike = Math.max(step, Math.round(S * 0.7 / step) * step);
    const maxStrike = Math.round(S * 1.3 / step) * step;

    const strikes = [];
    for (let K = baseStrike; K <= maxStrike; K += step) {
      if (K <= 0) continue;
      const callPrice = blackScholes('call', S, K, T, r, sigma);
      const putPrice = blackScholes('put', S, K, T, r, sigma);

      strikes.push({
        strike: K,
        callBid: Math.max(0.01, +(callPrice * 0.97).toFixed(2)),
        callAsk: Math.max(0.02, +(callPrice * 1.03).toFixed(2)),
        callMid: Math.max(0.01, +callPrice.toFixed(2)),
        putBid: Math.max(0.01, +(putPrice * 0.97).toFixed(2)),
        putAsk: Math.max(0.02, +(putPrice * 1.03).toFixed(2)),
        putMid: Math.max(0.01, +putPrice.toFixed(2)),
        isATM: Math.abs(K - Math.round(S / step) * step) < step / 2,
      });
    }

    return strikes;
  }

  _strikeStep(S) {
    if (S < 25) return 1;
    if (S < 100) return 2.5;
    if (S < 250) return 5;
    return 10;
  }

  /** Bid/ask for stock with a small spread (5 bps each side). */
  getStockQuote() {
    const mid = this.currentPrice;
    return {
      bid: +(mid * 0.9995).toFixed(2),
      ask: +(mid * 1.0005).toFixed(2),
      mid: +mid.toFixed(2),
    };
  }

  /**
   * Get the price of a specific option given its details.
   */
  getOptionPrice(type, strike) {
    const S = this.currentPrice;
    const daysLeft = this.getDaysRemaining();
    const T = Math.max(daysLeft / 365, 0.005);
    const mid = blackScholes(type, S, strike, T, this.riskFreeRate, this.volatility);
    return {
      bid: Math.max(0.01, +(mid * 0.97).toFixed(2)),
      ask: Math.max(0.02, +(mid * 1.03).toFixed(2)),
      mid: Math.max(0.01, +mid.toFixed(2)),
    };
  }

  /** For display: generate price movement stats */
  getStats() {
    const history = this.getPriceHistory();
    const change = history.length > 1 ? history[history.length - 1] - history[0] : 0;
    const changePct = history.length > 1 ? (change / history[0]) * 100 : 0;
    return { change, changePct, high: Math.max(...history), low: Math.min(...history) };
  }
}
