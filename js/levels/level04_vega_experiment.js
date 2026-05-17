/**
 * Level 4 — 波动率实验
 * Phase 1, difficulty 2. 观察任务。
 */
LEVEL_DEFINITIONS.push({
  id: 4,
  title: '波动率实验：为什么贵贱差这么多',
  shortTitle: '波动率实验',
  description: '本关市场波动率很高，相同到期日的期权权利金会贵很多。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第四关：波动率怎么影响期权价格 (Vega ν)</h3>

    <p>同样的 ATM Call，30 天到期：</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>稳定的蓝筹股（年化波动 20%）→ 大概 \$2.5</li>
      <li>暴涨暴跌的科技股（年化波动 60%）→ 大概 \$7</li>
    </ul>

    <p>同一只股票，权利金差了 <strong>2-3 倍</strong>。为什么？</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">原理：波动率 = 期权的"燃料"</h4>
    <p>期权买方赌的是"股价能不能动到我想要的方向"。波动率越大，<strong>价格能跑到的范围越大</strong>，期权价值就越高。</p>

    <div class="highlight-box" style="margin: 12px 0;">
      🎲 <strong>赌大小类比</strong>：你押"涨过 \$110"，30 天后：<br>
      → 老老实实的股票，30 天涨过 \$110 的概率 = 15%<br>
      → 狂野的股票，30 天涨过 \$110 的概率 = 50%<br>
      后者的"权利"自然贵很多
    </div>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">Vega — 波动率敏感度</h4>
    <p><strong>Vega (ν)</strong> 衡量：波动率每变化 1%，期权价格变化多少。</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>波动率上升 → 期权变贵（<span style="color: var(--accent-green);">买方赚 Vega</span>）</li>
      <li>波动率下降 → 期权变便宜（<span style="color: var(--accent-red);">买方亏 Vega</span>）</li>
      <li>ATM 期权的 Vega 最大；深度虚值/实值的 Vega 较小</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">实战意义</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>财报前期权很贵</strong> = 隐含波动率被炒高（IV Crush 风险）</li>
      <li><strong>财报后期权暴跌</strong> = 不确定性消失，波动率瞬间回归正常</li>
      <li>"买财报"经常输给"卖财报"的根本原因</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法（观察任务）</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>本关波动率高达 <strong>60%</strong>（普通股票 25-30%）</li>
      <li>买入 1 份 ATM Call 或 Put（你随意选方向）</li>
      <li>对比这里的权利金 vs 第 1 关的（同样的 ATM、同样的到期），感受高波动率的影响</li>
      <li>推进几天看看 — 高波动 = 大涨大跌 = 盈亏也更剧烈</li>
    </ol>
  `,
  knowledgePanel: `
    <h4>策略：在高波动市场买入并观察</h4>
    <div class="highlight-box">
      <strong>对比上一关</strong>：本关波动率 60% (vs 第 3 关 25%)<br>
      → ATM 期权权利金会贵 <strong>2 倍以上</strong><br>
      → 同时股价波动也会更剧烈
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，波动率 <strong>{SIGMA}</strong></li>
      <li>ATM Call: <strong style="color: var(--accent-green);">{ATM_CALL}</strong> | ATM Put: <strong style="color: var(--accent-red);">{ATM_PUT}</strong></li>
      <li>持仓面板 <strong>Net ν</strong> = 波动率每变 1% 你赚/亏多少</li>
      <li>通关条件：买入任意期权 + 推进至少 10 天</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.60,
  totalDays: 25,
  drift: 0.05,
  allowedActions: ['buy_call', 'buy_put'],
  winCondition: (pnl, portValue, day, portfolio) => {
    const closed = portfolio.getClosedPositions().some(p => !p.isStock && p.isLong);
    const open = portfolio.getPositionSummary().longCalls + portfolio.getPositionSummary().longPuts > 0;
    return day >= 10 && (open || closed);
  },
  winText: '买入任意期权并推进至少 10 天',
  difficulty: 2,
  tags: ['Vega', '观察任务'],
  phase: 1,
  checklist: [
    { label: '买入过 Call 或 Put', check: (c) => {
      const s = c.portfolio.getPositionSummary();
      const closed = c.portfolio.getClosedPositions().some(p => !p.isStock && p.isLong);
      return s.longCalls + s.longPuts > 0 || closed;
    } },
    { label: '推进至少 10 天', check: (c) => c.day >= 10 },
  ],
});
