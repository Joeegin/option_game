/**
 * Level 9 — Protective Put
 * Phase 4. Migrated from old Level 5.
 */
LEVEL_DEFINITIONS.push({
  id: 9,
  title: '保护性看跌策略',
  shortTitle: 'Protective Put',
  description: 'Covered Call 是"收租"，Protective Put 是"上保险"。持股的同时买 Put 限制下行。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第九关：Protective Put</h3>

    <p>你持有股票，但担心短期下跌（财报、宏观事件等）。怎么办？</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 持有 100 股股票 (Long Stock)</li>
      <li><strong>腿 2</strong>: 买入 1 份 Put (Long Put)，通常选 ATM 或略 OTM</li>
    </ul>

    <div class="highlight-box" style="margin: 12px 0;">
      🛡 <strong>类比：给股票上车险</strong><br>
      Put 权利金 = 保费<br>
      行权价 = 保额（最低卖出价）<br>
      到期日 = 保险期<br>
      股价大跌 → Put 赔付损失<br>
      股价上涨 → 保险白买，但股票赚得多
    </div>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">关键公式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>最大亏损 = (买入价 - 行权价 + 权利金) × 股数（<strong>有下限！</strong>）</li>
      <li>最大盈利 = 无上限（股价可以一直涨）</li>
      <li>盈亏平衡 = 买入价 + 权利金</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">Covered Call vs Protective Put</h4>
    <div class="highlight-box" style="margin: 12px 0;">
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr><td style="padding: 4px 8px; font-weight: bold;">Covered Call</td><td style="padding: 4px 8px;">收权利金</td><td style="padding: 4px 8px;">限制上行</td><td style="padding: 4px 8px;">无下行保护</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Protective Put</td><td style="padding: 4px 8px;">付权利金</td><td style="padding: 4px 8px;">保留上行</td><td style="padding: 4px 8px;">有下行保护</td></tr>
      </table>
    </div>
  `,
  knowledgePanel: `
    <h4>策略：Protective Put</h4>
    <p><strong>步骤：</strong>先<strong style="color: var(--accent-green);">买入股票</strong> → 再<strong style="color: var(--accent-green);">买入 Put</strong></p>
    <div class="highlight-box">
      <strong>Protective Put = Long Stock + Long Put</strong><br>
      市场偏空（drift = -5%）<br>
      <strong>必须先买保险再持仓</strong>！
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，波动率 <strong>{SIGMA}</strong></li>
      <li>通关：同时持有股票 + Put，6 天后亏损不超过 $50</li>
      <li>选 ATM Put 保护效果最好</li>
    </ul>
  `,
  initialCash: 12000,
  initialPrice: 100,
  volatility: 0.45,
  totalDays: 30,
  drift: -0.05,
  allowedActions: ['buy_stock', 'sell_stock', 'buy_put'],
  winCondition: (pnl, _, day, portfolio) => {
    const summary = portfolio.getPositionSummary();
    return day > 5 && pnl > -50 && summary.longStock > 0 && summary.longPuts > 0;
  },
  winText: '6 日后仍持有股票+Put，且亏损不超过 $50',
  difficulty: 3,
  tags: ['Protective Put', '对冲'],
  phase: 4,
  checklist: [
    { label: '持有股票', check: (c) => c.portfolio.getPositionSummary().longStock > 0 },
    { label: '持有 Put 保护', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
    { label: '已过第 6 天', check: (c) => c.day > 5 },
    { label: '亏损 ≤ $50', check: (c) => c.pnl > -50 },
  ],
});
