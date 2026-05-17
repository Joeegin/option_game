/**
 * Level 16 — Free Trading
 * Phase 8. Migrated from old Level 10.
 */
LEVEL_DEFINITIONS.push({
  id: 16,
  title: '自由交易大师',
  shortTitle: '自由交易',
  description: '最终关卡！运用学到的所有武器，在复杂市场中实现最大盈利。',
  tutorial: `
    <h3 style="color: var(--accent-yellow); margin-bottom: 12px;">最终挑战 — 自由交易</h3>

    <p>恭喜走到最后一关！你的武器库已经完整：</p>

    <table style="width: 100%; text-align: left; font-size: 13px; border-collapse: collapse;">
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">1-2</td><td style="padding: 4px 8px;">单腿做多</td><td style="padding: 4px 8px;">Call / Put 基础</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">3-4</td><td style="padding: 4px 8px;">观察实验</td><td style="padding: 4px 8px;">Theta / Vega 体感</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">5</td><td style="padding: 4px 8px;">Greeks 综合</td><td style="padding: 4px 8px;">敞口管理</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">6-7</td><td style="padding: 4px 8px;">卖方视角</td><td style="padding: 4px 8px;">Short Call / Put</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">8-9</td><td style="padding: 4px 8px;">持仓增强</td><td style="padding: 4px 8px;">Covered Call / Protective Put</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">10-11</td><td style="padding: 4px 8px;">垂直价差</td><td style="padding: 4px 8px;">Bull/Bear Spreads</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">12-13</td><td style="padding: 4px 8px;">波动率策略</td><td style="padding: 4px 8px;">Straddle / Strangle</td></tr>
      <tr><td style="padding: 4px 8px; color: var(--accent-blue);">14-15</td><td style="padding: 4px 8px;">高级组合</td><td style="padding: 4px 8px;">Butterfly / Iron Condor</td></tr>
    </table>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">市场参数</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>波动率适中（35%），方向不明确</li>
      <li>40 天交易窗口</li>
      <li>初始 \$15,000，目标盈利 \$1,000</li>
      <li>股票 + Call + Put 全部开放</li>
    </ul>

    <p style="margin-top: 16px; color: var(--accent-green);"><strong>策略提示：</strong></p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>先观察 5-10 天，判断趋势再下单</li>
      <li>看到方向 → 用 Spread 控制成本</li>
      <li>横盘 → Iron Condor 收 Theta</li>
      <li>不确定 → 小仓位 + 多组合分散风险</li>
    </ul>
  `,
  knowledgePanel: `
    <h4>自由交易模式</h4>
    <p>所有操作开放——综合运用！</p>
    <div class="highlight-box">
      <strong>提示：</strong><br>
      上涨 → Bull Call Spread / Covered Call<br>
      下跌 → Bear Put Spread / Protective Put<br>
      大波动 → Straddle / Strangle<br>
      横盘 → Iron Condor / Butterfly
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，σ <strong>{SIGMA}</strong></li>
      <li>资金 \$15,000，目标 \$1,000</li>
    </ul>
  `,
  initialCash: 15000,
  initialPrice: 100,
  volatility: 0.35,
  totalDays: 40,
  drift: 0.00,
  allowedActions: ['buy_call', 'sell_call', 'buy_put', 'sell_put', 'buy_stock', 'sell_stock'],
  winCondition: (pnl) => pnl > 1000,
  winText: '盈利超过 $1000',
  difficulty: 5,
  tags: ['综合', '挑战'],
  phase: 8,
  checklist: [
    { label: '盈利 > $1000', check: (c) => c.pnl > 1000 },
  ],
});
