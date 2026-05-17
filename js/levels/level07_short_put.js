/**
 * Level 7 — 卖出 Put
 * Phase 3, difficulty 3.
 */
LEVEL_DEFINITIONS.push({
  id: 7,
  title: '卖 Put：愿意低价接货',
  shortTitle: '卖出 Put',
  description: '卖出 Put = 同意"如果股价跌到 X 就以 X 接货"，靠收权利金赚钱。',
  tutorial: `
    <h3 style="color: var(--accent-orange); margin-bottom: 12px;">第七关：卖出 Put (Short Put)</h3>

    <p>卖 Put 是<strong>巴菲特最爱用的策略之一</strong>。逻辑非常朴素：</p>

    <div class="highlight-box" style="margin: 12px 0;">
      🛒 <strong>"我反正想以 \$90 买入这只股票"</strong><br>
      → 现在卖一份 \$90 行权价的 Put，收 \$3 权利金<br>
      → 到期股价 \$95（没跌到 \$90）→ Put 作废，你<strong>白赚 \$3</strong>，相当于"想买没买上但收了租金"<br>
      → 到期股价 \$85 → 你必须以 \$90 接货，但本来你就想买的，<strong>实际成本 = 90 - 3 = \$87</strong>（比直接买便宜）
    </div>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">两种结局都好</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>股价没跌过行权价 → 拿权利金走人，相当于"租金"</li>
      <li>股价跌过行权价 → 接货，但成本已经被权利金降低</li>
      <li>真正的风险：股价<strong>暴跌</strong>到远低于行权价，接货后还要继续亏损</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">和 Short Call 的本质区别</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>Short Call 最大亏损 = <span style="color: var(--accent-red);">理论无限</span>（股价没上限）</li>
      <li>Short Put 最大亏损 = <strong>行权价 - 权利金</strong>（股价跌到 0 时）</li>
      <li>所以 Short Put 比 Short Call 安全得多</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">⚠️ 同样要保证金</h4>
    <p>裸卖 Put 也占用保证金（约 行权价的 20% × 100 股）。本关初始资金 \$12,000 足够卖 1-2 份。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>市场温和震荡（drift 接近 0），股价应该跌不破行权价</li>
      <li>选一个<strong>虚值 Put</strong>（行权价 <strong>低于</strong>现价 5-10 美元）</li>
      <li>点 PUT 列的红色 <strong>S</strong> 卖出 1 份</li>
      <li>推进到到期，Put 作废，全额收下权利金</li>
    </ol>
  `,
  knowledgePanel: `
    <h4>策略：卖出虚值 Put</h4>
    <div class="highlight-box">
      <strong>Short Put</strong> = 卖出 Put<br>
      最大盈利 = 权利金<br>
      最大亏损 = 行权价 - 权利金 (股价跌到 0)<br>
      盈亏平衡点 = 行权价 - 权利金
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>建议选 OTM Put（行权价 < 现价）</li>
      <li>权利金立刻入账，但保证金会被冻结</li>
      <li>Net Θ 是正数 — 时间在帮你赚钱</li>
    </ul>
  `,
  initialCash: 12000,
  initialPrice: 100,
  volatility: 0.28,
  totalDays: 25,
  drift: -0.01,
  allowedActions: ['sell_put', 'buy_put'],
  winCondition: (pnl) => pnl > 100,
  winText: '盈利超过 $100',
  difficulty: 3,
  tags: ['Short Put', '卖方'],
  phase: 3,
  checklist: [
    { label: '至少卖出一份 Put', check: (c) => {
      const closed = c.portfolio.getClosedPositions().some(p => !p.isStock && p.optionType === 'put' && !p.isLong);
      return c.portfolio.getPositionSummary().shortPuts > 0 || closed;
    } },
    { label: '盈利 > $100', check: (c) => c.pnl > 100 },
  ],
});
