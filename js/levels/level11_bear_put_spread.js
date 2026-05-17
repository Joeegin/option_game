/**
 * Level 11 — Bear Put Spread
 * Phase 5. Migrated from old Level 7.
 */
LEVEL_DEFINITIONS.push({
  id: 11,
  title: '熊市看跌价差',
  shortTitle: 'Bear Put Spread',
  description: 'Bull Call Spread 的镜像。买入高行权 Put + 卖出低行权 Put。看跌但不会暴跌。',
  tutorial: `
    <h3 style="color: var(--accent-red); margin-bottom: 12px;">第十一关：Bear Put Spread</h3>

    <p>逻辑和 Bull Call Spread 完全对称：</p>

    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买入高行权 Put (Long Put @ K₁)</li>
      <li><strong>腿 2</strong>: 卖出低行权 Put (Short Put @ K₂)</li>
      <li>K₁ > K₂，到期日相同</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">公式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>净成本 = 买入权利金 - 卖出权利金</li>
      <li>最大盈利 = (K₁ - K₂) × 100 - 净成本</li>
      <li>盈亏平衡 = K₁ - 净成本</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>例: 买 \$100 Put @\$3 + 卖 \$90 Put @\$1 → 净成本 \$2 / 最大收益 \$800 / 平衡点 \$98</em></p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">什么时候用</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>看跌但<strong>不认为会暴跌</strong></li>
      <li>裸买 Put 太贵，想用卖 Put 降低成本</li>
      <li>放弃 K₂ 以下的超额盈利换取成本降低</li>
    </ul>
  `,
  knowledgePanel: `
    <h4>策略：Bear Put Spread</h4>
    <div class="highlight-box">
      <strong>Long Put(K高) + Short Put(K低)</strong><br>
      净成本 = 买入 - 卖出<br>
      最大收益 = 价差 × 100 - 净成本
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，drift -6%</li>
      <li>建议：买 ATM Put + 卖 OTM Put（低 10 点）</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.35,
  totalDays: 30,
  drift: -0.06,
  allowedActions: ['buy_put', 'sell_put'],
  winCondition: (pnl) => pnl > 300,
  winText: '盈利超过 $300',
  difficulty: 3,
  tags: ['Bear Spread', '价差'],
  phase: 5,
  checklist: [
    { label: '买入高行权 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
    { label: '卖出低行权 Put', check: (c) => c.portfolio.getPositionSummary().shortPuts > 0 },
    { label: '盈利 > $300', check: (c) => c.pnl > 300 },
  ],
});
