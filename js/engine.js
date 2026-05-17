/**
 * Black-Scholes Option Pricing Engine
 */

// Cumulative distribution function for standard normal distribution
function normCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Standard normal probability density function
function normPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2.0 * Math.PI);
}

/**
 * Calculate option price using Black-Scholes formula
 * @param {'call'|'put'} type
 * @param {number} S - Spot price of underlying
 * @param {number} K - Strike price
 * @param {number} T - Time to expiration (in years)
 * @param {number} r - Risk-free interest rate
 * @param {number} sigma - Volatility
 * @returns {number} Option price
 */
function blackScholes(type, S, K, T, r, sigma) {
  if (T <= 0) {
    if (type === 'call') return Math.max(0, S - K);
    return Math.max(0, K - S);
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (type === 'call') {
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  }
}

/**
 * Calculate option Greeks
 * @returns {{ delta, gamma, theta, vega, rho }}
 */
function calculateGreeks(type, S, K, T, r, sigma) {
  if (T <= 0) T = 0.0001;

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const pdf = normPDF(d1);

  let delta;
  if (type === 'call') {
    delta = normCDF(d1);
  } else {
    delta = normCDF(d1) - 1;
  }

  const gamma = pdf / (S * sigma * Math.sqrt(T));
  const vega = (S * pdf * Math.sqrt(T)) / 100;

  let theta;
  if (type === 'call') {
    theta = (-S * pdf * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2);
  } else {
    theta = (-S * pdf * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCDF(-d2);
  }
  theta = theta / 365;

  let rho;
  if (type === 'call') {
    rho = (K * T * Math.exp(-r * T) * normCDF(d2)) / 100;
  } else {
    rho = (-K * T * Math.exp(-r * T) * normCDF(-d2)) / 100;
  }

  return { delta, gamma, theta, vega, rho };
}
