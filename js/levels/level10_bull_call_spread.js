/**
 * Level 10 — Bull Call Spread
 * Phase 5. Migrated from old Level 6.
 */
LEVEL_DEFINITIONS.push({
  id: 10,
  title: '牛市看涨价差',
  shortTitle: 'Bull Call Spread',
  description: '买入低行权 Call + 卖出高行权 Call。用卖出的收入降低买入成本。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第十关：Bull Call Spread</h3>

    <p>看涨但不会大涨？直接买 Call 太贵？这就是<strong>垂直价差</strong>的用武之地。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买入低行权 Call (Long Call @ K₁) — 支付权利金</li>
      <li><strong>腿 2</strong>: 卖出高行权 Call (Short Call @ K₂) — 收取权利金</li>
      <li>K₁ < K₂，到期日相同</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">公式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>净成本 (最大亏损) = 买入权利金 - 卖出权利金</li>
      <li>最大盈利 = (K₂ - K₁) × 100 - 净成本</li>
      <li>盈亏平衡 = K₁ + 净成本</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>例: 买 \$100 Call @\$3 + 卖 \$110 Call @\$1 → 净成本 \$2 / 最大收益 \$800 / 平衡点 \$102</em></p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">关键洞察</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>卖出的 Call 不是孤立的——它有买入的 Call <strong>覆盖</strong>，不会真的无限亏损</li>
      <li>这种"两腿互相对冲"的结构是价差策略的核心</li>
      <li>代价是放弃了 K₂ 以上的上行空间</li>
    </ul>
  `,
  knowledgePanel: `
    <h4>策略：Bull Call Spread</h4>
    <div class="highlight-box">
      <strong>Long Call(K低) + Short Call(K高)</strong><br>
      净成本 = 买入 - 卖出<br>
      最大收益 = 价差 × 100 - 净成本
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，drift +8%</li>
      <li>建议：买 ATM Call + 卖 OTM Call（高 5-10 点）</li>
      <li>注意 Net Δ 应该是正数（看涨方向）但比单买 Call 小</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.30,
  totalDays: 30,
  drift: 0.08,
  allowedActions: ['buy_call', 'sell_call'],
  winCondition: (pnl) => pnl > 300,
  winText: '盈利超过 $300',
  difficulty: 3,
  tags: ['Bull Spread', '价差'],
  phase: 5,
  checklist: [
    { label: '买入低行权 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
    { label: '卖出高行权 Call', check: (c) => c.portfolio.getPositionSummary().shortCalls > 0 },
    { label: '盈利 > $300', check: (c) => c.pnl > 300 },
  ],
});
