/**
 * Level 1 — 我的第一笔 Call
 * Phase 1, difficulty 1.
 * 友好参数: drift 较大、totalDays 长、winCondition 较低。
 */
LEVEL_DEFINITIONS.push({
  id: 1,
  title: '我的第一笔 Call',
  shortTitle: 'Call 基础',
  description: '看涨期权 = 一张"以约定价买入"的权利凭证。看涨时使用。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第一关：买入你的第一份 Call</h3>

    <p>欢迎来到第一关！我们用一个简单的类比开始：</p>

    <div class="highlight-box" style="margin: 12px 0;">
      🏠 <strong>买房定金</strong>：你看中一套 100 万的房子，付 1 万定金锁定半年的价格。<br>
      → 半年后房价涨到 120 万，你按约定 100 万买入，赚 19 万（扣定金）<br>
      → 半年后房价跌到 80 万，你放弃买入，损失就是这 1 万定金
    </div>

    <p><strong>看涨期权 (Call Option)</strong> 就是股票市场上的同款合约：</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>权利金</strong> = 定金（必须支付）</li>
      <li><strong>行权价</strong> = 锁定的买入价</li>
      <li><strong>到期日</strong> = 期限</li>
      <li><strong>1 份合约 = 100 股</strong>（合约乘数）</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏一句话</h4>
    <p>到期时：<strong>盈亏 = max(股价 - 行权价, 0) - 权利金</strong></p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>股价 <strong>没涨过</strong> 行权价 → 损失 = 全部权利金（合约作废）</li>
      <li>股价 <strong>涨过</strong> 行权价 + 权利金 → 开始盈利，<span style="color: var(--accent-green);">理论上无上限</span></li>
      <li><strong>最大损失 = 你付出的权利金</strong>（不会爆仓）</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关怎么玩</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>点击下方"开始交易"</li>
      <li>在左侧 <strong>期权链</strong> 找一个行权价（建议选最接近 \$100 的，叫 ATM）</li>
      <li>点 CALL 列下的绿色 <strong>B</strong> (Buy) 按钮买入 1 份</li>
      <li>用 <strong>下一日 ▶</strong> 推进时间（或按空格键），观察股价和权利金变化</li>
      <li>看到盈利时点击持仓的 <strong>平仓</strong> 按钮锁定收益</li>
    </ol>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>💡 本关市场有明显的上涨趋势，新手友好。专注于"感受 Call 的盈亏方式"，不用追求高收益。</em></p>
  `,
  knowledgePanel: `
    <h4>策略：买入看涨期权</h4>
    <p>这是 <strong style="color: var(--accent-green);">最简单的方向性多头</strong> — 看涨就买 Call。</p>
    <div class="highlight-box">
      <strong>盈亏平衡点：</strong> 行权价 + 权利金<br>
      <strong>最大亏损：</strong> 全部权利金<br>
      <strong>最大盈利：</strong> 理论无上限
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>ATM Call 参考价：<strong style="color: var(--accent-green);">{ATM_CALL}</strong></li>
      <li>右侧 <strong>Payoff 图</strong> 会显示你的盈亏曲线，蓝实线 = 到期盈亏，虚线 = 当前盈亏</li>
      <li>不要选太高的行权价（深度虚值），那种 Call 需要股价大涨才能盈利</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.30,
  totalDays: 40,
  drift: 0.18,
  allowedActions: ['buy_call'],
  winCondition: (pnl) => pnl > 80,
  winText: '盈利超过 $80',
  difficulty: 1,
  tags: ['Long Call', '入门'],
  phase: 1,
  checklist: [
    { label: '至少买入一份 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
    { label: '盈利 > $80', check: (c) => c.pnl > 80 },
  ],
});
