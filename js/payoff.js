/**
 * Payoff Diagram
 * Renders an at-expiration profit/loss curve for the current portfolio,
 * plus a "today" curve using Black-Scholes for live mark-to-market.
 */
const PayoffDiagram = (() => {
  const W = 360, H = 180;
  const M = { top: 14, right: 14, bottom: 26, left: 38 };

  function payoffAtExpiry(positions, S) {
    let total = 0;
    for (const p of positions) {
      const mult = p.isStock ? 1 : 100;
      const sign = p.isLong ? 1 : -1;
      let value;
      if (p.isStock) {
        value = S - p.entryPremium;
      } else if (p.optionType === 'call') {
        value = Math.max(0, S - p.strike) - p.entryPremium;
      } else {
        value = Math.max(0, p.strike - S) - p.entryPremium;
      }
      total += sign * value * p.quantity * mult;
    }
    return total;
  }

  function payoffNow(positions, S, sigma, T) {
    let total = 0;
    for (const p of positions) {
      const mult = p.isStock ? 1 : 100;
      const sign = p.isLong ? 1 : -1;
      let value;
      if (p.isStock) {
        value = S - p.entryPremium;
      } else {
        const price = blackScholes(p.optionType, S, p.strike, Math.max(T, 0.0001), 0.03, sigma);
        value = price - p.entryPremium;
      }
      total += sign * value * p.quantity * mult;
    }
    return total;
  }

  function findBreakEvens(samples) {
    const points = [];
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1];
      const b = samples[i];
      if ((a.y <= 0 && b.y >= 0) || (a.y >= 0 && b.y <= 0)) {
        const t = a.y / (a.y - b.y);
        const x = a.x + t * (b.x - a.x);
        points.push(x);
      }
    }
    return points;
  }

  function render(mountEl, positions, currentPrice, sigma, T) {
    if (!mountEl) return;
    if (!positions || positions.length === 0) {
      mountEl.innerHTML = '';
      return;
    }

    // Domain: ±35% around current
    const lo = currentPrice * 0.65;
    const hi = currentPrice * 1.35;
    const steps = 60;
    const expirySamples = [];
    const nowSamples = [];
    for (let i = 0; i <= steps; i++) {
      const S = lo + (hi - lo) * (i / steps);
      expirySamples.push({ x: S, y: payoffAtExpiry(positions, S) });
      nowSamples.push({ x: S, y: payoffNow(positions, S, sigma, T) });
    }

    const ys = expirySamples.map(s => s.y).concat(nowSamples.map(s => s.y));
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const padY = Math.max(Math.abs(maxY - minY) * 0.1, 20);
    const yLo = minY - padY;
    const yHi = maxY + padY;

    const xScale = (x) => M.left + (x - lo) / (hi - lo) * (W - M.left - M.right);
    const yScale = (y) => M.top + (1 - (y - yLo) / (yHi - yLo)) * (H - M.top - M.bottom);

    const path = (samples) => samples.map((s, i) =>
      (i === 0 ? 'M' : 'L') + xScale(s.x).toFixed(1) + ',' + yScale(s.y).toFixed(1)
    ).join(' ');

    const breakEvens = findBreakEvens(expirySamples);
    const zeroY = yScale(0);
    const curY = yScale(0);
    const curX = xScale(currentPrice);

    // Y-axis ticks
    const yTicks = 4;
    let gridLines = '';
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yLo + (yHi - yLo) * (i / yTicks);
      const yPx = yScale(yVal);
      gridLines += `<line x1="${M.left}" y1="${yPx}" x2="${W - M.right}" y2="${yPx}" stroke="rgba(42,46,58,0.5)" stroke-width="0.5"/>`;
      gridLines += `<text x="${M.left - 4}" y="${yPx + 3}" fill="#5a5e6e" font-size="9" text-anchor="end">${yVal >= 0 ? '+' : ''}${yVal.toFixed(0)}</text>`;
    }

    // X-axis ticks
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
      const xVal = lo + (hi - lo) * (i / xTicks);
      const xPx = xScale(xVal);
      gridLines += `<text x="${xPx}" y="${H - 8}" fill="#5a5e6e" font-size="9" text-anchor="middle">$${xVal.toFixed(0)}</text>`;
    }

    // Break-even markers
    let beMarkers = '';
    for (const be of breakEvens) {
      const x = xScale(be);
      beMarkers += `<line x1="${x}" y1="${M.top}" x2="${x}" y2="${H - M.bottom}" stroke="#ffd740" stroke-width="0.7" stroke-dasharray="3,3" opacity="0.6"/>`;
      beMarkers += `<text x="${x}" y="${M.top - 2}" fill="#ffd740" font-size="9" text-anchor="middle">BE $${be.toFixed(1)}</text>`;
    }

    const svg = `
      <svg viewBox="0 0 ${W} ${H}" class="payoff-svg" preserveAspectRatio="xMidYMid meet">
        <rect x="${M.left}" y="${M.top}" width="${W - M.left - M.right}" height="${H - M.top - M.bottom}" fill="#0f1117" stroke="#2a2e3a" stroke-width="0.5"/>
        ${gridLines}
        <line x1="${M.left}" y1="${zeroY}" x2="${W - M.right}" y2="${zeroY}" stroke="#5a5e6e" stroke-width="0.8"/>
        ${beMarkers}
        <line x1="${curX}" y1="${M.top}" x2="${curX}" y2="${H - M.bottom}" stroke="#448aff" stroke-width="0.7" stroke-dasharray="2,2" opacity="0.7"/>
        <text x="${curX}" y="${H - M.bottom + 12}" fill="#448aff" font-size="9" text-anchor="middle">现价 $${currentPrice.toFixed(1)}</text>

        <path d="${path(nowSamples)}" fill="none" stroke="#8b8fa3" stroke-width="1" stroke-dasharray="3,2" opacity="0.7"/>
        <path d="${path(expirySamples)}" fill="none" stroke="#448aff" stroke-width="1.8"/>

        <g transform="translate(${W - M.right - 110},${M.top + 4})" font-size="9" fill="#8b8fa3">
          <rect x="-4" y="-2" width="110" height="26" fill="rgba(15,17,23,0.7)" stroke="#2a2e3a" stroke-width="0.5"/>
          <line x1="0" y1="6" x2="14" y2="6" stroke="#448aff" stroke-width="1.8"/>
          <text x="18" y="9">到期盈亏</text>
          <line x1="0" y1="18" x2="14" y2="18" stroke="#8b8fa3" stroke-width="1" stroke-dasharray="3,2"/>
          <text x="18" y="21">当前盈亏</text>
        </g>
      </svg>`;

    mountEl.innerHTML = svg;
  }

  return { render, payoffAtExpiry, payoffNow };
})();
