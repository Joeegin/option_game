/**
 * Level 8 — Covered Call (持股 + 卖出 Call)
 * Phase 4. Migrated from old Level 4.
 */
LEVEL_DEFINITIONS.push({
  id: 8,
  title: '备兑看涨策略',
  shortTitle: 'Covered Call',
  description: '已经会单独卖 Call 了？给它加一条腿：先持股，再卖 Call。最经典的"被动收入"策略。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第八关：Covered Call</h3>

    <p>第 6 关裸卖 Call 风险无限——因为如果股价大涨，你必须按低价交付股票，亏损没有上限。</p>

    <p><strong>Covered Call</strong> 通过提前持股解决了这个问题：股价涨了正好用你的股票交付，"卖飞了"也不会爆仓。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 持有 100 股股票 (Long Stock)</li>
      <li><strong>腿 2</strong>: 卖出 1 份 Call (Short Call)，通常选虚值</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">三种情景</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>股价跌</strong> → 股票亏，但权利金降低了持股成本，比单独持股亏得少</li>
      <li><strong>股价小涨（没过行权价）</strong> → 股票赚 + 权利金赚 = 最佳情景</li>
      <li><strong>股价大涨（过行权价）</strong> → 股票被以行权价卖出，<span style="color: var(--accent-yellow);">收益封顶</span></li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">公式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>最大盈利 = (行权价 - 买入价 + 权利金) × 股数</li>
      <li>盈亏平衡 = 买入价 - 权利金</li>
      <li>最大亏损 = 买入价 - 权利金（股价跌到 0）</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>💡 适合长期持有的股票，每月卖一份 Call 收"租金"。这是退休账户的常见玩法。</em></p>
  `,
  knowledgePanel: `
    <h4>策略：Covered Call</h4>
    <p><strong>步骤：</strong>先<strong style="color: var(--accent-green);">买入股票</strong> → 再<strong style="color: var(--accent-red);">卖出 Call</strong></p>
    <div class="highlight-box">
      <strong>Covered Call = Long Stock + Short Call</strong><br>
      上行被限制，但已经持股了 → 不会爆仓<br>
      权利金立即降低持仓成本
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>建议先买 100 股股票，再卖一份虚值 Call（行权价 > 现价）</li>
      <li>组合 Net Θ 应该是正数 — 时间帮你赚钱</li>
    </ul>
  `,
  initialCash: 12000,
  initialPrice: 100,
  volatility: 0.25,
  totalDays: 30,
  drift: 0.03,
  allowedActions: ['buy_stock', 'sell_stock', 'buy_call', 'sell_call'],
  winCondition: (pnl) => pnl > 250,
  winText: '盈利超过 $250',
  difficulty: 3,
  tags: ['Covered Call', '收入策略'],
  phase: 4,
  checklist: [
    { label: '持有股票', check: (c) => c.portfolio.getPositionSummary().longStock > 0 },
    { label: '卖出 Call', check: (c) => c.portfolio.getPositionSummary().shortCalls > 0 },
    { label: '盈利 > $250', check: (c) => c.pnl > 250 },
  ],
});
