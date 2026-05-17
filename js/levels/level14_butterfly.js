/**
 * Level 14 — Butterfly Spread
 * Phase 7. Migrated from old Level 9.
 */
LEVEL_DEFINITIONS.push({
  id: 14,
  title: '蝶式价差策略',
  shortTitle: 'Butterfly',
  description: '三腿组合：买 K低 + 卖 2×K中 + 买 K高。低成本，但需要股价"停"在中间。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第十四关：Butterfly Spread</h3>

    <p>Straddle/Strangle 赌波动；Butterfly 反过来——赌<strong>横盘</strong>。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成（Call 蝶式）</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买 1 份低行权 Call (K₁)</li>
      <li><strong>腿 2</strong>: 卖 2 份中行权 Call (K₂ = 目标价)</li>
      <li><strong>腿 3</strong>: 买 1 份高行权 Call (K₃)</li>
      <li>K₁ < K₂ < K₃，间距相等（如 95/100/105）</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>最大亏损 = 净付出的权利金（通常很小）</li>
      <li>最大盈利 = (K₂ - K₁) × 100 - 净成本，在 K₂ 处取得</li>
      <li>盈利形状像<strong>一只蝴蝶</strong>——中间最高，两边归零</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>例: 买 \$95 Call @\$6 + 卖 2×\$100 Call @\$3 + 买 \$105 Call @\$1 → 净成本 \$1，最大收益 \$400（股价正好停 \$100）</em></p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么用蝶式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>极低成本（卖出 2 份几乎完全抵消买入成本）</li>
      <li>风险可控（最大亏损 = 净成本）</li>
      <li>精准——判断对位置时回报率很高</li>
      <li>财报后波动率塌缩时的常用策略</li>
    </ul>
  `,
  knowledgePanel: `
    <h4>策略：Butterfly</h4>
    <div class="highlight-box">
      <strong>Long(K低) + Short 2×(K中) + Long(K高)</strong><br>
      目标：股价停在 K中 附近<br>
      本关 σ 低 + drift 弱 → 股价容易停 \$100
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>选等间距三个行权价（如 95/100/105）</li>
      <li>三腿都要建好才是蝶式</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.25,
  totalDays: 20,
  drift: 0.01,
  allowedActions: ['buy_call', 'sell_call', 'buy_put', 'sell_put'],
  winCondition: (pnl) => pnl > 400,
  winText: '盈利超过 $400',
  difficulty: 5,
  tags: ['Butterfly', '精准'],
  phase: 7,
  checklist: [
    { label: '至少 3 个不同行权价的腿', check: (c) => {
      const ks = new Set(c.portfolio.getPositions().filter(p => !p.isStock).map(p => p.strike));
      return ks.size >= 3;
    } },
    { label: '盈利 > $400', check: (c) => c.pnl > 400 },
  ],
});
