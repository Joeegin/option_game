/**
 * Price Chart — Canvas-based chart for price history visualization
 */
class PriceChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.margin = { top: 30, right: 30, bottom: 40, left: 60 };
    this.tradeMarkers = []; // { day, price, type: 'buy'|'sell', label }
    this.lastPriceHistory = [];
    this.lastMarkers = [];
    this.showLegend = true;
    this._resizeHandler = () => {
      if (this._resize() && this.lastPriceHistory.length) {
        this.draw(this.lastPriceHistory, this.lastMarkers);
      }
    };
    window.addEventListener('resize', this._resizeHandler);
    this._resize();
  }

  _resize() {
    const container = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(container.clientWidth * dpr);
    const height = Math.floor(container.clientHeight * dpr);

    if (width <= 0 || height <= 0) return false;
    if (this.canvas.width === width && this.canvas.height === height) return false;

    this.canvas.width = width;
    this.canvas.height = height;
    return true;
  }

  /**
   * Draw the price chart
   * @param {number[]} priceHistory - Array of prices
   * @param {object[]} markers - Trade markers
   */
  draw(priceHistory, markers = []) {
    this.tradeMarkers = markers;
    this.lastPriceHistory = priceHistory;
    this.lastMarkers = markers;
    const ctx = this.ctx;
    const prices = priceHistory.filter(Number.isFinite);

    // Keep the backing store in sync with the rendered size.
    this._resize();

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (cw === 0 || ch === 0) return;

    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.scale(dpr, dpr);

    const W = cw / dpr;
    const H = ch / dpr;
    const m = this.margin;
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;

    // Single data point: just show the price as text centered
    if (prices.length < 2) {
      const price = prices[0] || 0;
      ctx.fillStyle = '#5a5e6e';
      ctx.font = '13px "SF Mono", "Menlo", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('起始价格: $' + price.toFixed(2), W / 2, H / 2 - 10);
      ctx.fillText('推进到下一天后图表将开始绘制', W / 2, H / 2 + 14);
      ctx.restore();
      return;
    }

    const minP = Math.min(...prices) * 0.98;
    const maxP = Math.max(...prices) * 1.02;
    const rangeP = maxP - minP || 1;

    const xScale = i => m.left + (i / Math.max(prices.length - 1, 1)) * plotW;
    const yScale = p => m.top + (1 - (p - minP) / rangeP) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(42, 46, 58, 0.6)';
    ctx.lineWidth = 0.5;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = m.top + (i / gridLines) * plotH;
      ctx.beginPath();
      ctx.moveTo(m.left, y);
      ctx.lineTo(W - m.right, y);
      ctx.stroke();

      // Price label
      const price = maxP - (i / gridLines) * rangeP;
      ctx.fillStyle = '#5a5e6e';
      ctx.font = '11px "SF Mono", "Menlo", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('$' + price.toFixed(1), m.left - 8, y + 4);
    }

    // Day labels on x-axis
    ctx.textAlign = 'center';
    for (let i = 0; i < prices.length; i += Math.max(1, Math.floor(prices.length / 6))) {
      const x = xScale(i);
      ctx.fillText('D' + i, x, H - m.bottom + 18);
    }

    // Price line
    ctx.strokeStyle = '#448aff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = xScale(i);
      const y = yScale(p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Gradient fill under line
    const lastX = xScale(prices.length - 1);
    ctx.lineTo(lastX, m.top + plotH);
    ctx.lineTo(m.left, m.top + plotH);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, m.top, 0, m.top + plotH);
    gradient.addColorStop(0, 'rgba(68, 138, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(68, 138, 255, 0.01)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Re-draw main line on top
    ctx.strokeStyle = '#448aff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = xScale(i);
      const y = yScale(p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Current price dot
    const curIdx = prices.length - 1;
    const curX = xScale(curIdx);
    const curY = yScale(prices[curIdx]);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#448aff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Trade markers
    for (const marker of this.tradeMarkers) {
      const mx = xScale(marker.day);
      const my = yScale(marker.price);
      ctx.fillStyle = marker.type === 'buy' ? '#00c853' : '#ff1744';
      ctx.beginPath();
      if (marker.type === 'buy') {
        // Triangle up
        ctx.moveTo(mx, my - 12);
        ctx.lineTo(mx - 8, my);
        ctx.lineTo(mx + 8, my);
      } else {
        // Triangle down
        ctx.moveTo(mx, my + 12);
        ctx.lineTo(mx - 8, my);
        ctx.lineTo(mx + 8, my);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  addMarker(day, price, type, label) {
    this.tradeMarkers.push({ day, price, type, label });
  }

  clearMarkers() {
    this.tradeMarkers = [];
  }

  destroy() {
    window.removeEventListener('resize', this._resizeHandler);
  }
}
