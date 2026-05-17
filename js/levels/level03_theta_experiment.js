/**
 * Level 3 — Theta 时间衰减实验
 * Phase 1, difficulty 1. 观察任务: 不要求盈利, 只要求"完成观察"。
 */
LEVEL_DEFINITIONS.push({
  id: 3,
  title: 'Theta 实验：感受时间衰减',
  shortTitle: 'Theta 实验',
  description: '即使股价不动，期权也会随时间贬值。本关让你亲眼看到时间衰减。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第三关：观察时间衰减 (Theta θ)</h3>

    <p>期权和股票最大的区别：<strong>期权会过期</strong>。距离到期日越近，期权剩余的"时间价值"越小——即使股价完全没动，期权也会一天天变便宜。</p>

    <p>这种"价格随时间流逝而衰减"的现象叫 <strong>Theta 衰减 (θ)</strong>，是期权<strong>买方最大的敌人</strong>，也是<strong>卖方最爱的朋友</strong>。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">三个关键规律</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>买方每天亏 Theta</strong>：哪怕股价完全没动，今天的 Call 就比昨天便宜一点</li>
      <li><strong>越接近到期，衰减越快</strong>：剩 30 天 vs 剩 5 天，每天蒸发的钱差好几倍</li>
      <li><strong>ATM 期权 Theta 最大</strong>：平值期权时间价值最多，损失也最多</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">类比：融化的冰块 🧊</h4>
    <p>买入 Call/Put 就像买了一块冰：</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>你买它是赌它能变大（股价朝你想的方向走）</li>
      <li>但它本身就在<strong>每天变小一点</strong></li>
      <li>所以期权买方要么<strong>快进快出</strong>，要么<strong>需要大行情</strong>来覆盖 Theta 成本</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法（观察任务）</h4>
    <p>这一关<strong>不要求盈利</strong>，只要求你完成一次观察：</p>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>市场设定为<strong>横盘</strong>（drift = 0），股价基本不动</li>
      <li>买入 1 份 ATM Call</li>
      <li>记录买入价</li>
      <li>什么都不做，连续按 10 次"下一日"（或用 +5 按钮）</li>
      <li>对比当前 Call 价格 vs 买入价 → 看 Theta 蒸发了多少</li>
    </ol>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>💡 持仓面板顶部的 <strong>Θ</strong> 数字就是你今天会损失的金额（已乘 100 股）。</em></p>
  `,
  knowledgePanel: `
    <h4>策略：买入并观察</h4>
    <p>本关目的是<strong>感受 Theta</strong>，不是赚钱。</p>
    <div class="highlight-box">
      <strong>观察目标：</strong><br>
      买入 1 份 ATM Call，推进 10 天，观察价格如何下降<br>
      关注持仓面板的 <strong>Net Θ</strong>（每日损失的美元）
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，波动率 <strong>{SIGMA}</strong></li>
      <li>市场设定为横盘，方便观察纯时间衰减</li>
      <li>通关条件：买入 Call + 推进到至少第 10 天</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.25,
  totalDays: 30,
  drift: 0.0,
  allowedActions: ['buy_call'],
  winCondition: (pnl, portValue, day, portfolio) => {
    return day >= 10 && (portfolio.getPositionSummary().longCalls > 0 || portfolio.getRealizedPnL() !== 0);
  },
  winText: '买入 Call 并推进至少 10 天（盈亏不重要）',
  difficulty: 1,
  tags: ['Theta', '观察任务'],
  phase: 1,
  checklist: [
    { label: '买入过 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 || c.portfolio.getClosedPositions().some(p => !p.isStock && p.optionType === 'call' && p.isLong) },
    { label: '推进至少 10 天', check: (c) => c.day >= 10 },
  ],
});
