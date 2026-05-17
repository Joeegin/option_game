/**
 * Level 15 — Iron Condor
 * Phase 7. NEW.
 */
LEVEL_DEFINITIONS.push({
  id: 15,
  title: '铁鹰式策略',
  shortTitle: 'Iron Condor',
  description: '四腿组合：卖一个 Call Spread + 卖一个 Put Spread。横盘时收 Theta，是月度收入策略的王者。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第十五关：Iron Condor</h3>

    <p>这是<strong>专业期权交易员最爱的策略之一</strong>。逻辑非常聪明：</p>

    <p>蝶式赌"股价正好停在 K₂"——很精准但概率小。能不能改成赌"股价停在某个<strong>区间</strong>内"？这就是铁鹰。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成（四条腿）</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买 K₁ Put（最低）— 保险</li>
      <li><strong>腿 2</strong>: 卖 K₂ Put（次低）</li>
      <li><strong>腿 3</strong>: 卖 K₃ Call（次高）</li>
      <li><strong>腿 4</strong>: 买 K₄ Call（最高）— 保险</li>
      <li>K₁ < K₂ < 现价 < K₃ < K₄</li>
    </ul>

    <p>本质 = <strong>卖一个 Put Spread (Bull Put Spread) + 卖一个 Call Spread (Bear Call Spread)</strong></p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>最大盈利</strong> = 净收到的权利金（开仓即拿）</li>
      <li><strong>最大亏损</strong> = (K₂ - K₁) × 100 - 净权利金（或 K₄ - K₃ - 净权利金，取大的）</li>
      <li><strong>盈利区</strong> = 股价在 K₂ 和 K₃ 之间（含两端附近的爬升）</li>
      <li>到期股价在 K₂-K₃ 区间 → 四份期权全部作废 → 净权利金全收</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">Payoff 像一只展翅的鸟</h4>
    <p>中间是平顶的盈利区，两侧是斜下的亏损区，再往外是两侧的"翅膀"（被保险腿封顶）。看 Payoff 图就知道为什么叫"Iron Condor (铁鹰)"。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么这么受欢迎</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>胜率高</strong>：股价停在区间内的概率通常 60-70%</li>
      <li><strong>风险有上限</strong>（被两个"翅膀"封顶）</li>
      <li><strong>Theta 友好</strong>：净 Theta 为正，每天躺着收钱</li>
      <li><strong>资金效率高</strong>：保证金需求比裸卖小很多</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>选 4 个行权价，建议 \$90 / \$95 / \$105 / \$110</li>
      <li>买 \$90 Put + 卖 \$95 Put + 卖 \$105 Call + 买 \$110 Call</li>
      <li>开仓后 Net Θ 应该是正数（你在收时间衰减）</li>
      <li>市场设定为<strong>低波动横盘</strong>，股价大概率停在 \$95-\$105 区间</li>
    </ol>
  `,
  knowledgePanel: `
    <h4>策略：Iron Condor</h4>
    <div class="highlight-box">
      <strong>四腿：Long Put(K1) + Short Put(K2) + Short Call(K3) + Long Call(K4)</strong><br>
      K1 < K2 < S < K3 < K4<br>
      胜利条件：到期股价在 K2-K3 之间
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，波动率 <strong>{SIGMA}</strong></li>
      <li>建议: 买 \$90 Put + 卖 \$95 Put + 卖 \$105 Call + 买 \$110 Call</li>
      <li>开仓即收净权利金，Net Θ 应该是正数</li>
      <li>看 Payoff 图的<strong>平顶</strong>形状</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.22,
  totalDays: 25,
  drift: 0.0,
  allowedActions: ['buy_call', 'sell_call', 'buy_put', 'sell_put'],
  winCondition: (pnl) => pnl > 200,
  winText: '盈利超过 $200',
  difficulty: 5,
  tags: ['Iron Condor', '收入策略'],
  phase: 7,
  checklist: [
    { label: '至少 4 个不同行权价的腿', check: (c) => {
      const ks = new Set(c.portfolio.getPositions().filter(p => !p.isStock).map(p => p.strike));
      return ks.size >= 4;
    } },
    { label: '同时有 Put 和 Call', check: (c) => {
      const ps = c.portfolio.getPositions().filter(p => !p.isStock);
      return ps.some(p => p.optionType === 'put') && ps.some(p => p.optionType === 'call');
    } },
    { label: '盈利 > $200', check: (c) => c.pnl > 200 },
  ],
});
