/**
 * Level 2 — 我的第一笔 Put
 * Phase 1, difficulty 1.
 */
LEVEL_DEFINITIONS.push({
  id: 2,
  title: '我的第一笔 Put',
  shortTitle: 'Put 基础',
  description: '看跌期权 = 一张"以约定价卖出"的权利凭证。看跌时使用。',
  tutorial: `
    <h3 style="color: var(--accent-red); margin-bottom: 12px;">第二关：买入你的第一份 Put</h3>

    <p>Call 是"以约定价<strong>买入</strong>的权利"，那 Put 就是它的镜像——"以约定价<strong>卖出</strong>的权利"。</p>

    <div class="highlight-box" style="margin: 12px 0;">
      🛡 <strong>给股票买保险</strong>：你持有的股票现价 \$100，担心它跌。你花 \$3 买一份 Put（行权价 \$100）。<br>
      → 股价跌到 \$80，你可以按 \$100 卖出 → 保险赔付 \$20，扣权利金净赚 \$17/股<br>
      → 股价涨到 \$120，保险白买了 → 损失就 \$3/股
    </div>

    <p>但 Put 不只用来"保险"，<strong>也可以单独作为做空工具</strong>：看跌时买入 Put，股价跌得越多越赚。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏一句话</h4>
    <p>到期时：<strong>盈亏 = max(行权价 - 股价, 0) - 权利金</strong></p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>股价 <strong>没跌破</strong> 行权价 → 损失 = 全部权利金</li>
      <li>股价 <strong>跌破</strong> 行权价 - 权利金 → 开始盈利</li>
      <li>最大盈利 = 行权价 - 权利金（股价跌到 0 时）</li>
      <li><strong>最大损失 = 你付出的权利金</strong>（不会爆仓）</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">和裸做空股票的对比</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>裸做空：股价涨了你<strong>无限亏损</strong></li>
      <li>买 Put：股价涨了你<strong>最多亏权利金</strong></li>
      <li>这就是为什么职业交易员宁愿买 Put 也不裸做空</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关怎么玩</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>本关市场有<strong>下跌趋势</strong>（drift 为负）</li>
      <li>在期权链右侧 PUT 列点 <strong>B</strong> 买入 1 份 Put（选 ATM）</li>
      <li>推进几天，看股价怎么跌、Put 怎么涨</li>
      <li>盈利时及时平仓</li>
    </ol>
  `,
  knowledgePanel: `
    <h4>策略：买入看跌期权</h4>
    <p><strong style="color: var(--accent-red);">看跌就买 Put</strong>。</p>
    <div class="highlight-box">
      <strong>盈亏平衡点：</strong> 行权价 - 权利金<br>
      <strong>最大亏损：</strong> 全部权利金<br>
      <strong>最大盈利：</strong> 行权价 - 权利金（股价到 0）
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>ATM Put 参考价：<strong style="color: var(--accent-red);">{ATM_PUT}</strong></li>
      <li>市场趋势偏空，ATM 或略低行权价的 Put 最适合</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.30,
  totalDays: 40,
  drift: -0.15,
  allowedActions: ['buy_put'],
  winCondition: (pnl) => pnl > 80,
  winText: '盈利超过 $80',
  difficulty: 1,
  tags: ['Long Put', '入门'],
  phase: 1,
  checklist: [
    { label: '至少买入一份 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
    { label: '盈利 > $80', check: (c) => c.pnl > 80 },
  ],
});
