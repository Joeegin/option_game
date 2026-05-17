/**
 * Level Definitions
 * Each level defines the game scenario, available actions, and win conditions.
 *
 * Placeholders (replaced at runtime):
 *   {S} = current stock price
 *   {T} = days remaining
 *   {ATM_CALL} = ATM call price
 *   {ATM_PUT} = ATM put price
 *   {SIGMA} = volatility
 */
const LEVEL_DEFINITIONS = [
  // ────────────────────────────────────────────
  // LEVEL 1 — Call Option Basics
  // ────────────────────────────────────────────
  {
    id: 1,
    title: '什么是看涨期权',
    shortTitle: 'Call 基础',
    description: '看涨期权（Call Option）赋予买方在到期日前以约定价格（行权价）买入标的资产的权利，而非义务。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">看涨期权 (Call Option)</h3>

      <p>看涨期权是一种<strong>金融衍生品合约</strong>。它赋予买方一项权利，而非义务——在合约到期日之前，以预先约定的价格（行权价）买入标的资产（如股票）。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">合约要素</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>标的资产</strong>：期权对应的股票或 ETF</li>
        <li><strong>行权价 (Strike)</strong>：合约约定的买入价格</li>
        <li><strong>到期日 (Expiration)</strong>：合约的有效期限</li>
        <li><strong>权利金 (Premium)</strong>：买方支付给卖方的费用，即期权的市场价格</li>
        <li><strong>合约乘数</strong>：每份期权合约通常代表 100 股</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
      <p>买入 Call 的盈亏 = <strong>max(股价 - 行权价, 0) - 权利金</strong></p>
      <ul style="text-align: left; line-height: 1.8;">
        <li>股价 ≤ 行权价 → 期权到期作废，<span style="color: var(--accent-red);">亏损 = 全部权利金</span></li>
        <li>行权价 < 股价 < 行权价 + 权利金 → 部分挽回，仍亏损</li>
        <li>股价 > 行权价 + 权利金 → <span style="color: var(--accent-green);">开始盈利</span></li>
        <li>理论上收益<strong>无上限</strong>，最大亏损<strong>仅限于权利金</strong></li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么要买 Call？</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>杠杆效应</strong>：用较少的权利金控制更多股票的名义价值</li>
        <li><strong>风险可控</strong>：最大亏损就是付出的权利金，不会爆仓</li>
        <li><strong>替代买股</strong>：看好一只股票但不想投入全部资金，可以用 Call 代替</li>
      </ul>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>举例：股价 $100，行权价 $100 的 Call 权利金 $3。股价涨到 $110，期权内在价值 $10，盈利 = $10 - $3 = $7/股，1 份合约赚 $700。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：买入看涨期权</h4>
      <p>你只能<strong style="color: var(--accent-green);">买入 Call</strong>。在期权链中点击 CALL 列下的 <strong style="color: var(--accent-green);">B</strong> 按钮。</p>
      <div class="highlight-box">
        <strong>目标：</strong>等待股价上涨，在合适的时机平仓。<br>
        <strong>盈亏平衡点：</strong>行权价 + 权利金<br>
        <strong>最大亏损：</strong>全部权利金
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>ATM Call 参考价：<strong style="color: var(--accent-green);">{ATM_CALL}</strong></li>
        <li>选择略高于现价的行权价可以降低成本，但需要更大的涨幅才能盈利</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.35,
    totalDays: 30,
    drift: 0.10,
    allowedActions: ['buy_call'],
    winCondition: (pnl) => pnl > 100,
    winText: '盈利超过 $100',
    difficulty: 1,
    tags: ['Long Call', '方向交易'],
    checklist: [
      { label: '至少买入一份 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
      { label: '总盈亏 > $100', check: (c) => c.pnl > 100 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 2 — Put Option Basics
  // ────────────────────────────────────────────
  {
    id: 2,
    title: '什么是看跌期权',
    shortTitle: 'Put 基础',
    description: '看跌期权（Put Option）赋予买方在到期日前以约定价格卖出标的资产的权利。预期股价下跌时使用。',
    tutorial: `
      <h3 style="color: var(--accent-red); margin-bottom: 12px;">看跌期权 (Put Option)</h3>

      <p>看跌期权与看涨期权<strong>方向相反</strong>。买方支付权利金，获得在到期日前以行权价<strong>卖出</strong>股票的权利。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">合约要素（与 Call 相同）</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>标的资产</strong>、<strong>行权价</strong>、<strong>到期日</strong>、<strong>权利金</strong>、<strong>合约乘数（100 股）</strong></li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
      <p>买入 Put 的盈亏 = <strong>max(行权价 - 股价, 0) - 权利金</strong></p>
      <ul style="text-align: left; line-height: 1.8;">
        <li>股价 ≥ 行权价 → 期权到期作废，<span style="color: var(--accent-red);">亏损 = 全部权利金</span></li>
        <li>行权价 - 权利金 < 股价 < 行权价 → 部分挽回，仍亏损</li>
        <li>股价 < 行权价 - 权利金 → <span style="color: var(--accent-green);">开始盈利</span></li>
        <li>最大收益 = 行权价 - 权利金（股价跌到 0），最大亏损<strong>仅限于权利金</strong></li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么买 Put？</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>做空工具</strong>：不通过融券也能从下跌中获利</li>
        <li><strong>对冲风险</strong>：持有股票的同时买 Put 做保险（后面会学到）</li>
        <li><strong>风险可控</strong>：最大亏损就是权利金，不像裸做空可能无限亏损</li>
      </ul>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>举例：股价 $100，行权价 $100 的 Put 权利金 $3。股价跌到 $85，期权内在价值 $15，盈利 = $15 - $3 = $12/股，1 份合约赚 $1200。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：买入看跌期权</h4>
      <p>你只能<strong style="color: var(--accent-red);">买入 Put</strong>。在期权链中点击 PUT 列下的 <strong style="color: var(--accent-green);">B</strong> 按钮。</p>
      <div class="highlight-box">
        <strong>目标：</strong>等待股价下跌，在合适的时机平仓获利。<br>
        <strong>盈亏平衡点：</strong>行权价 - 权利金<br>
        <strong>最大亏损：</strong>全部权利金
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>ATM Put 参考价：<strong style="color: var(--accent-red);">{ATM_PUT}</strong></li>
        <li>市场趋势偏空（drift 为负），选 ATM 或略低行权价的 Put</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.35,
    totalDays: 30,
    drift: -0.08,
    allowedActions: ['buy_put'],
    winCondition: (pnl) => pnl > 100,
    winText: '盈利超过 $100',
    difficulty: 1,
    tags: ['Long Put', '方向交易'],
    checklist: [
      { label: '至少买入一份 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
      { label: '总盈亏 > $100', check: (c) => c.pnl > 100 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 3 — Option Pricing Factors
  // ────────────────────────────────────────────
  {
    id: 3,
    title: '期权价格的影响因素',
    shortTitle: '定价因素',
    description: '期权价格受标的价格、行权价、剩余时间、波动率和利率五大因素影响，理解它们之间的关系至关重要。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">期权价格的五大驱动因素（Greeks 简介）</h3>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">1. 标的价格 (Delta δ)</h4>
      <p>Delta 衡量期权价格对标的资产价格的敏感度。</p>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>Call Delta</strong>：0 到 +1 之间。ATM Call 约 +0.5</li>
        <li><strong>Put Delta</strong>：-1 到 0 之间。ATM Put 约 -0.5</li>
        <li>股价涨 $1 → Call 涨 Delta 美元，Put 跌 |Delta| 美元</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">2. 时间衰减 (Theta θ)</h4>
      <p>Theta 衡量期权价格随时间流逝的衰减速度。</p>
      <ul style="text-align: left; line-height: 1.8;">
        <li>期权买方每天承受 Theta 损耗（<span style="color: var(--accent-red);">对买方不利</span>）</li>
        <li>期权卖方每天赚取 Theta 收入（<span style="color: var(--accent-green);">对卖方有利</span>）</li>
        <li>临近到期日，时间衰减加速（最后 30 天最快）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">3. 波动率 (Vega ν)</h4>
      <p>Vega 衡量期权价格对隐含波动率的敏感度。</p>
      <ul style="text-align: left; line-height: 1.8;">
        <li>波动率越高 → 期权越贵（<span style="color: var(--accent-green);">买方不利，卖方有利</span>）</li>
        <li>波动率越低 → 期权越便宜（<span style="color: var(--accent-green);">买方有利，卖方不利</span>）</li>
        <li>ATM 期权的 Vega 最大</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">4. 行权价 & 5. 无风险利率</h4>
      <p>行权价越接近现价（ATM），期权的时间价值越高。利率影响相对较小。</p>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>提示：在本关中，注意观察随着天数减少，期权价格怎样变化——这就是 Theta 时间衰减在起作用。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：灵活买卖 Call 和 Put</h4>
      <p>你可以<strong>买入 Call</strong> 和 <strong>买入 Put</strong>。下方为当前 ATM 期权的实时 Greeks 数据：</p>
      <div class="highlight-box">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="color: var(--text-muted);">
            <td style="padding: 3px 8px;"></td>
            <td style="padding: 3px 8px; text-align: center;">Delta δ</td>
            <td style="padding: 3px 8px; text-align: center;">Gamma γ</td>
            <td style="padding: 3px 8px; text-align: center;">Theta θ</td>
            <td style="padding: 3px 8px; text-align: center;">Vega ν</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; color: var(--accent-green); font-weight: bold;">ATM Call</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{CALL_DELTA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{CALL_GAMMA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--accent-red);">{CALL_THETA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{CALL_VEGA}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; color: var(--accent-red); font-weight: bold;">ATM Put</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{PUT_DELTA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{PUT_GAMMA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--accent-red);">{PUT_THETA}</td>
            <td style="padding: 3px 8px; text-align: center; color: var(--text-primary);">{PUT_VEGA}</td>
          </tr>
        </table>
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，波动率 <strong>{SIGMA}</strong></li>
        <li>ATM Call <strong style="color: var(--accent-green);">{ATM_CALL}</strong> | ATM Put <strong style="color: var(--accent-red);">{ATM_PUT}</strong></li>
        <li><strong>Delta</strong>：股价每涨 $1，Call 涨 Delta 美元；Put 跌 |Delta| 美元</li>
        <li><strong>Theta</strong>（红色）：每天时间衰减的金额，对买方不利</li>
        <li>推进天数观察 Theta 如何侵蚀期权价格！</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.30,
    totalDays: 30,
    drift: 0.02,
    allowedActions: ['buy_call', 'buy_put'],
    winCondition: (pnl) => pnl > 200,
    winText: '盈利超过 $200',
    difficulty: 2,
    tags: ['Greeks', 'Delta/Theta'],
    checklist: [
      { label: '总盈亏 > $200', check: (c) => c.pnl > 200 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 4 — Covered Call
  // ────────────────────────────────────────────
  {
    id: 4,
    title: '备兑看涨策略',
    shortTitle: 'Covered Call',
    description: '备兑看涨（Covered Call）：持有股票的同时卖出虚值看涨期权，通过收取权利金增强收益，适合温和看涨或中性市场。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">备兑看涨 (Covered Call)</h3>

      <p>Covered Call 是期权交易中<strong>最基础的收入策略</strong>。投资者持有 100 股（或更多）股票，同时卖出一份对应股票的看涨期权。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：持有 100 股股票（Long Stock）</li>
        <li><strong>腿 2</strong>：卖出一份 Call（Short Call），通常选虚值（行权价 > 现价）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏分析</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>最大收益</strong> = (行权价 - 买入价 + 权利金) × 股数</li>
        <li><strong>最大亏损</strong> = 买入价 - 权利金（股价跌到 0）</li>
        <li><strong>盈亏平衡点</strong> = 股票买入价 - 权利金</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">三种情景</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>股价跌破买入价 - 权利金</strong> → <span style="color: var(--accent-red);">亏损</span>，但比单独持股亏得少（Call 权利金提供了缓冲）</li>
        <li><strong>股价在盈亏平衡点和行权价之间</strong> → <span style="color: var(--accent-green);">盈利</span>，且期权到期作废，保留股票</li>
        <li><strong>股价涨超行权价</strong> → <span style="color: var(--accent-yellow);">盈利但被限制</span>，股票被行权卖出，无法享受超额涨幅</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略优缺点</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><span style="color: var(--accent-green);">优点</span>：立刻获得权利金收入；降低持股成本；适合横盘或温和上涨</li>
        <li><span style="color: var(--accent-red);">缺点</span>：限制上行收益；仍面临下行风险；需要持有 100 股整数倍的股票</li>
      </ul>
    `,
    knowledgePanel: `
      <h4>当前策略：备兑看涨</h4>
      <p><strong>步骤：</strong> 先<strong style="color: var(--accent-green);">买入股票</strong> → 再<strong style="color: var(--accent-red);">卖出 Call</strong></p>
      <div class="highlight-box">
        <strong>Covered Call = Long Stock + Short Call</strong><br>
        卖出 Call 收取权利金 = 立即降低持股成本<br>
        选择行权价高于当前价格的 Call（虚值），给股票留上涨空间。
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>先买 1 股股票，再选一个虚值 Call 卖出</li>
        <li>股票 + Short Call 组合 = Covered Call ✓</li>
      </ul>
    `,
    initialCash: 12000,
    initialPrice: 100,
    volatility: 0.25,
    totalDays: 30,
    drift: 0.03,
    allowedActions: ['buy_stock', 'sell_stock', 'buy_call', 'sell_call'],
    winCondition: (pnl) => pnl > 300,
    winText: '盈利超过 $300',
    difficulty: 2,
    tags: ['Covered Call', '收入策略'],
    checklist: [
      { label: '持有股票', check: (c) => c.portfolio.getPositionSummary().longStock > 0 },
      { label: '卖出 Call', check: (c) => c.portfolio.getPositionSummary().shortCalls > 0 },
      { label: '总盈亏 > $300', check: (c) => c.pnl > 300 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 5 — Protective Put
  // ────────────────────────────────────────────
  {
    id: 5,
    title: '保护性看跌策略',
    shortTitle: 'Protective Put',
    description: '保护性看跌（Protective Put）：持有股票的同时买入看跌期权，像买保险一样限制下行风险，同时保留上行收益。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">保护性看跌 (Protective Put)</h3>

      <p>如果说 Covered Call 是"收租"，那么 Protective Put 就是"买保险"。持有股票的同时买入 Put，确保最坏情况下能以行权价卖出股票。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：持有 100 股股票（Long Stock）</li>
        <li><strong>腿 2</strong>：买入一份 Put（Long Put），通常选平值或略虚值</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏分析</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>最大亏损</strong> = (买入价 - 行权价 + 权利金) × 股数（有下限！）</li>
        <li><strong>最大收益</strong> = 理论上无限（股价可以一直涨）</li>
        <li><strong>盈亏平衡点</strong> = 股票买入价 + 权利金</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">类比：给股票买保险</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>Put 权利金 = 保费</li>
        <li>行权价 = 保额（最低卖出价）</li>
        <li>到期日 = 保险期限</li>
        <li>如果股票大跌 → Put 赔付损失</li>
        <li>如果股票涨了 → 保险浪费了，但股票赚了，总体还是赚</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">与 Covered Call 对比</h4>
      <div class="highlight-box">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr><td style="padding: 4px 8px; font-weight: bold;">Covered Call</td><td style="padding: 4px 8px;">收取权利金</td><td style="padding: 4px 8px;">限制上行</td><td style="padding: 4px 8px;">无下行保护</td></tr>
          <tr><td style="padding: 4px 8px; font-weight: bold;">Protective Put</td><td style="padding: 4px 8px;">支付权利金</td><td style="padding: 4px 8px;">保留上行</td><td style="padding: 4px 8px;">有下行保护</td></tr>
        </table>
      </div>
    `,
    knowledgePanel: `
      <h4>当前策略：保护性看跌</h4>
      <p><strong>步骤：</strong> 先<strong style="color: var(--accent-green);">买入股票</strong> → 再<strong style="color: var(--accent-green);">买入 Put</strong></p>
      <div class="highlight-box">
        <strong>Protective Put = Long Stock + Long Put</strong><br>
        买入 Put 像给股票上保险。<br>
        市场趋势偏空（drift = -5%），<strong>必须先保护再持仓</strong>！
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，波动率 <strong>{SIGMA}</strong></li>
        <li>通关条件：同时持有股票和 Put，亏损 < $50</li>
        <li>选接近现价的 Put（ATM）保护效果最好</li>
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
    checklist: [
      { label: '持有股票', check: (c) => c.portfolio.getPositionSummary().longStock > 0 },
      { label: '持有 Put 保护', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
      { label: '已过第 6 天', check: (c) => c.day > 5 },
      { label: '亏损 ≤ $50', check: (c) => c.pnl > -50 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 6 — Bull Call Spread
  // ────────────────────────────────────────────
  {
    id: 6,
    title: '牛市看涨价差',
    shortTitle: 'Bull Call Spread',
    description: '牛市看涨价差：买入低行权价 Call + 卖出高行权价 Call。利用卖出 Call 的收入降低成本，适合温和看涨。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">牛市看涨价差 (Bull Call Spread)</h3>

      <p>这是<strong>垂直价差策略</strong>的一种。同时买卖两个不同行权价的 Call，构建一个"成本更低、但收益封顶"的看涨头寸。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：买入低行权价 Call（Long Call @ K₁）— 支付权利金</li>
        <li><strong>腿 2</strong>：卖出高行权价 Call（Short Call @ K₂）— 收取权利金</li>
        <li>K₁ < K₂，且到期日相同</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">成本与收益</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>净成本（最大亏损）</strong> = 买入 Call 权利金 - 卖出 Call 权利金</li>
        <li><strong>最大收益</strong> = (K₂ - K₁) × 100 - 净成本</li>
        <li><strong>盈亏平衡点</strong> = K₁ + 净成本</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么用价差而非单买 Call？</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>卖出高行权 Call 的收入<strong>抵消了部分买入成本</strong></li>
        <li>如果判断"会涨但不会大涨"，卖出 Call 降低盈亏平衡点</li>
        <li>代价是限制了最大收益（超过 K₂ 的部分与你无关）</li>
      </ul>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>举例：股价 $100，买入 $100 Call @ $3，卖出 $110 Call @ $1。净成本 = $3 - $1 = $2。最大收益 = ($110 - $100 - $2) × 100 = $800。盈亏平衡 = $100 + $2 = $102。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：牛市看涨价差</h4>
      <p><strong>构建：</strong> 买入低行权 Call + 卖出高行权 Call</p>
      <div class="highlight-box">
        <strong>Bull Call Spread = Long Call(K低) + Short Call(K高)</strong><br>
        净成本 = 买入支出 - 卖出收入<br>
        最大收益 = (价差 - 净成本) × 100<br>
        市场趋势偏多（drift = +8%），控制成本是关键。
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>建议：买 ATM Call + 卖 OTM Call（高出 5-10 点）</li>
        <li>注意观察组合的净成本和最大收益</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.30,
    totalDays: 30,
    drift: 0.08,
    allowedActions: ['buy_call', 'sell_call'],
    winCondition: (pnl) => pnl > 400,
    winText: '盈利超过 $400',
    difficulty: 3,
    tags: ['Bull Call Spread', '价差'],
    checklist: [
      { label: '买入低行权 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
      { label: '卖出高行权 Call', check: (c) => c.portfolio.getPositionSummary().shortCalls > 0 },
      { label: '总盈亏 > $400', check: (c) => c.pnl > 400 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 7 — Bear Put Spread
  // ────────────────────────────────────────────
  {
    id: 7,
    title: '熊市看跌价差',
    shortTitle: 'Bear Put Spread',
    description: '熊市看跌价差：买入高行权价 Put + 卖出低行权价 Put。利用卖出 Put 的收入降低成本，适合温和看跌。',
    tutorial: `
      <h3 style="color: var(--accent-red); margin-bottom: 12px;">熊市看跌价差 (Bear Put Spread)</h3>

      <p>这是牛市看涨价差的<strong>镜像策略</strong>，适用于看跌预期。同时买卖两个不同行权价的 Put。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：买入高行权价 Put（Long Put @ K₁）— 支付权利金</li>
        <li><strong>腿 2</strong>：卖出低行权价 Put（Short Put @ K₂）— 收取权利金</li>
        <li>K₁ > K₂，到期日相同</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">成本与收益</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>净成本（最大亏损）</strong> = 买入 Put 权利金 - 卖出 Put 权利金</li>
        <li><strong>最大收益</strong> = (K₁ - K₂) × 100 - 净成本</li>
        <li><strong>盈亏平衡点</strong> = K₁ - 净成本</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">与直接买 Put 的对比</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><span style="color: var(--accent-green);">好处</span>：成本更低（卖 Put 有收入）</li>
        <li><span style="color: var(--accent-red);">代价</span>：如果股价暴跌超过 K₂，超额收益归零</li>
        <li>适合"看跌但不认为会暴跌"的场景</li>
      </ul>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>举例：股价 $100，买入 $100 Put @ $3，卖出 $90 Put @ $1。净成本 = $3 - $1 = $2。最大收益 = ($100 - $90 - $2) × 100 = $800。盈亏平衡 = $100 - $2 = $98。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：熊市看跌价差</h4>
      <p><strong>构建：</strong> 买入高行权 Put + 卖出低行权 Put</p>
      <div class="highlight-box">
        <strong>Bear Put Spread = Long Put(K高) + Short Put(K低)</strong><br>
        净成本 = 买入支出 - 卖出收入<br>
        最大收益 = (价差 - 净成本) × 100<br>
        市场趋势偏空（drift = -6%），卖出 Put 降低成本。
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>建议：买 ATM Put + 卖 OTM Put（低 10 点）</li>
        <li>注意组合的净成本，比单独买 Put 便宜很多</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.35,
    totalDays: 30,
    drift: -0.06,
    allowedActions: ['buy_put', 'sell_put'],
    winCondition: (pnl) => pnl > 400,
    winText: '盈利超过 $400',
    difficulty: 3,
    tags: ['Bear Put Spread', '价差'],
    checklist: [
      { label: '买入高行权 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
      { label: '卖出低行权 Put', check: (c) => c.portfolio.getPositionSummary().shortPuts > 0 },
      { label: '总盈亏 > $400', check: (c) => c.pnl > 400 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 8 — Straddle
  // ────────────────────────────────────────────
  {
    id: 8,
    title: '跨式策略',
    shortTitle: 'Straddle',
    description: '跨式策略：同时买入相同行权价的 Call 和 Put。不在乎方向，只赌波动幅度。适合重大事件前布局。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">跨式策略 (Long Straddle)</h3>

      <p>跨式策略是一种<strong>波动率策略</strong>——你不在乎股价涨还是跌，只在乎<strong>波动是否足够大</strong>。同时买入相同行权价、相同到期日的 Call 和 Put。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：买入一份 ATM Call（Long Call）</li>
        <li><strong>腿 2</strong>：买入一份 ATM Put（Long Put）</li>
        <li>行权价相同，通常选最接近当前股价的（ATM）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构（非常重要！）</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>最大亏损</strong> = Call 权利金 + Put 权利金（两份权利金）</li>
        <li><strong>上方盈亏平衡</strong> = 行权价 + 总权利金</li>
        <li><strong>下方盈亏平衡</strong> = 行权价 - 总权利金</li>
        <li><strong>盈利区间</strong>：股价 > 上方平衡点 或 股价 < 下方平衡点</li>
        <li><strong>亏损区间</strong>：股价在两个平衡点之间（不动就亏）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">适合什么场景？</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>财报发布、FDA 审批、重大政策公告等<strong>二元事件</strong></li>
        <li>预期有大幅波动，但不确定方向</li>
        <li>隐含波动率较低时买更划算（波动率上升也赚钱）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">风险提示</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>如果股价原地不动 → <span style="color: var(--accent-red);">两份权利金全亏</span></li>
        <li>时间衰减是<strong>双重打击</strong>（两份期权同时衰减）</li>
        <li>需要<strong>足够的波动幅度</strong>才能覆盖成本</li>
      </ul>
    `,
    knowledgePanel: `
      <h4>当前策略：跨式策略 (Straddle)</h4>
      <p><strong>构建：</strong> 同时买入相同行权的 Call + Put</p>
      <div class="highlight-box">
        <strong>Long Straddle = Long Call + Long Put (同K)</strong><br>
        总成本 = Call权利金 + Put权利金（两份！）<br>
        盈利条件：股价波动超过总成本<br>
        波动率高达 {SIGMA}，注意把握机会。
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>选 ATM 行权价同时买入 Call 和 Put</li>
        <li>目标是方向大幅波动——涨跌都行！</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.50,
    totalDays: 25,
    drift: 0.00,
    allowedActions: ['buy_call', 'buy_put', 'sell_call', 'sell_put'],
    winCondition: (pnl) => pnl > 500,
    winText: '盈利超过 $500',
    difficulty: 4,
    tags: ['Straddle', '波动率'],
    checklist: [
      { label: '买入 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
      { label: '买入 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
      { label: '总盈亏 > $500', check: (c) => c.pnl > 500 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 9 — Butterfly Spread
  // ────────────────────────────────────────────
  {
    id: 9,
    title: '蝶式价差策略',
    shortTitle: 'Butterfly Spread',
    description: '蝶式价差：三腿期权组合。买入一份低价+一份高价 Call，卖出两份中间价 Call。适合预期价格窄幅震荡。',
    tutorial: `
      <h3 style="color: var(--accent-blue); margin-bottom: 12px;">蝶式价差 (Butterfly Spread)</h3>

      <p>蝶式价差是一种<strong>低风险、低成本的精确策略</strong>，赌股价会落在某个特定价位附近。</p>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成（以 Call 蝶式为例）</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>腿 1</strong>：买入 1 份低价 Call（Long Call @ K₁ = 低行权）</li>
        <li><strong>腿 2</strong>：卖出 2 份中间价 Call（Short 2 Calls @ K₂ = 目标价）</li>
        <li><strong>腿 3</strong>：买入 1 份高价 Call（Long Call @ K₃ = 高行权）</li>
        <li>K₁ < K₂ < K₃，间距相等（如 90/100/110）</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li><strong>最大亏损</strong> = 净支付的权利金（通常很小）</li>
        <li><strong>最大收益</strong> = (K₂ - K₁) × 100 - 净成本（在 K₂ 处达到最大）</li>
        <li><strong>盈亏区间</strong>：K₁ + 净成本 < 股价 < K₃ - 净成本</li>
        <li><strong>盈利形状</strong>像一只蝴蝶——中间（K₂ 处）最高，两边归零</li>
      </ul>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么用蝶式？</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>成本极低（卖出 2 份几乎完全抵消买入 2 份的成本）</li>
        <li>风险可控（最大亏损就是净成本）</li>
        <li>精准度高——如果你的判断正确，回报率可以非常高</li>
        <li>适合"股价会停在某个价位"的精准预测</li>
      </ul>

      <p style="margin-top: 14px; color: var(--text-muted);"><em>举例：股价 $100，买 $95 Call @ $6，卖 2 份 $100 Call @ $3，买 $105 Call @ $1。净成本 = $6 - $6 + $1 = $1。最大收益 = ($5 - $1) × 100 = $400（股价正好停 $100）。</em></p>
    `,
    knowledgePanel: `
      <h4>当前策略：蝶式价差</h4>
      <p><strong>构建：</strong> 买 K低 + 卖 2×K中 + 买 K高（三腿！）</p>
      <div class="highlight-box">
        <strong>Butterfly = Long Call(K低) + Short 2 Calls(K中) + Long Call(K高)</strong><br>
        净成本非常低（卖出 2 份抵消买入成本）<br>
        目标：股价停在中间行权价附近。<br>
        市场波动率低 ({SIGMA})，drift 微弱，股价容易停在 $100 附近。
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
        <li>选等间距的三个行权价（如 95/100/105）</li>
        <li>必须三腿完整才算蝶式！</li>
      </ul>
    `,
    initialCash: 10000,
    initialPrice: 100,
    volatility: 0.25,
    totalDays: 20,
    drift: 0.01,
    allowedActions: ['buy_call', 'sell_call', 'buy_put', 'sell_put'],
    winCondition: (pnl) => pnl > 500,
    winText: '盈利超过 $500',
    difficulty: 5,
    tags: ['Butterfly', '精准策略'],
    checklist: [
      { label: '至少 3 个不同行权价的腿', check: (c) => {
        const ks = new Set(c.portfolio.getPositions().filter(p => !p.isStock).map(p => p.strike));
        return ks.size >= 3;
      } },
      { label: '总盈亏 > $500', check: (c) => c.pnl > 500 },
    ],
  },

  // ────────────────────────────────────────────
  // LEVEL 10 — Free Trading
  // ────────────────────────────────────────────
  {
    id: 10,
    title: '自由交易大师',
    shortTitle: '自由交易',
    description: '最终关卡！运用你学到的所有知识和策略，在复杂多变的市场中实现最大盈利。没有操作限制。',
    tutorial: `
      <h3 style="color: var(--accent-yellow); margin-bottom: 12px;">自由交易 — 最终挑战</h3>

      <p>恭喜来到最后一关！你现在已经掌握了期权交易的核心武器库：</p>

      <h4 style="color: var(--accent-blue); margin: 14px 0 6px;">你的工具箱</h4>
      <table style="width: 100%; text-align: left; font-size: 13px; border-collapse: collapse;">
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">1-2</td><td style="padding: 4px 8px;"><strong>Call & Put 基础</strong></td><td style="padding: 4px 8px;">方向性交易，杠杆做多/做空</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">3</td><td style="padding: 4px 8px;"><strong>定价因素 & Greeks</strong></td><td style="padding: 4px 8px;">理解时间、波动率的影响</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">4</td><td style="padding: 4px 8px;"><strong>Covered Call</strong></td><td style="padding: 4px 8px;">持股+卖 Call，收入策略</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">5</td><td style="padding: 4px 8px;"><strong>Protective Put</strong></td><td style="padding: 4px 8px;">持股+买 Put，保险策略</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">6-7</td><td style="padding: 4px 8px;"><strong>Bull/Bear Spreads</strong></td><td style="padding: 4px 8px;">价差策略，控制成本与风险</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">8</td><td style="padding: 4px 8px;"><strong>Straddle</strong></td><td style="padding: 4px 8px;">波动率策略，不赌方向赌幅度</td></tr>
        <tr><td style="padding: 4px 8px; color: var(--accent-blue);">9</td><td style="padding: 4px 8px;"><strong>Butterfly</strong></td><td style="padding: 4px 8px;">精准策略，低成本高回报</td></tr>
      </table>

      <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">市场环境</h4>
      <ul style="text-align: left; line-height: 1.8;">
        <li>波动率适中（35%），但有随机漂移——方向不明确</li>
        <li>40 天的交易窗口给你足够时间</li>
        <li>$15,000 起始资金，目标 $1,000 利润</li>
        <li>可以买卖股票、Call、Put——一切皆可用</li>
      </ul>

      <p style="margin-top: 16px; color: var(--accent-green);"><strong>运用你所学到的一切，证明你已经是一个合格的期权交易员！</strong></p>
    `,
    knowledgePanel: `
      <h4>自由交易模式</h4>
      <p><strong>所有操作全部开放</strong>——股票、Call、Put，买和卖都可以。</p>
      <div class="highlight-box">
        <strong>策略建议：</strong><br>
        观察市场走势后再决定策略——<br>
        上涨 → Bull Call Spread 或 Covered Call<br>
        下跌 → Bear Put Spread 或 Protective Put<br>
        大幅波动 → Straddle<br>
        横盘 → Butterfly 或 Covered Call
      </div>
      <ul>
        <li>标的价格 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，波动率 <strong>{SIGMA}</strong></li>
        <li>资金 $15,000，目标盈利 $1,000</li>
        <li>灵活切换策略，根据市场变化调整！</li>
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
    checklist: [
      { label: '总盈亏 > $1000', check: (c) => c.pnl > 1000 },
    ],
  },
];
