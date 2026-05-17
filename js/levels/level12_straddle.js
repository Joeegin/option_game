/**
 * Level 12 — Long Straddle
 * Phase 6. Migrated from old Level 8.
 */
LEVEL_DEFINITIONS.push({
  id: 12,
  title: '跨式策略',
  shortTitle: 'Straddle',
  description: '同时买入相同行权的 Call + Put。不赌方向，只赌"会大幅波动"。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第十二关：Long Straddle</h3>

    <p>之前的策略都需要判断方向（看涨/看跌）。如果你<strong>知道会有大事件</strong>，但<strong>不确定方向</strong>呢？</p>

    <p><strong>跨式策略 (Straddle)</strong> 同时买入相同行权价、相同到期日的 Call 和 Put — 涨跌都能赚，但需要<strong>足够大的波动</strong>。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买入 1 份 ATM Call</li>
      <li><strong>腿 2</strong>: 买入 1 份 ATM Put（同行权价）</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">盈亏结构</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>最大亏损 = 两份权利金之和 (横盘时)</li>
      <li>上方盈亏平衡 = 行权价 + 总权利金</li>
      <li>下方盈亏平衡 = 行权价 - 总权利金</li>
      <li>盈利区: 股价 > 上方平衡 或 股价 < 下方平衡</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">什么时候用</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>财报发布、FDA 审批、美联储决议等<strong>二元事件</strong>前</li>
      <li>预期会有大波动，但不知道方向</li>
      <li><strong>注意 IV Crush</strong>：事件后波动率塌缩，期权急跌</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>⚠️ 时间衰减是双倍打击（两份期权一起 Theta），所以 Straddle 适合"快进快出"。</em></p>
  `,
  knowledgePanel: `
    <h4>策略：Long Straddle</h4>
    <div class="highlight-box">
      <strong>Long Call + Long Put (同K)</strong><br>
      总成本 = Call权利金 + Put权利金<br>
      盈利条件：股价波动 > 总成本
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，波动率 <strong>{SIGMA}</strong></li>
      <li>选 ATM 行权价，同时买入 Call 和 Put</li>
      <li>目标是<strong>方向大幅波动</strong>——涨跌都行</li>
      <li>Net Δ 应该接近 0（中性），Net ν 应该很大（正）</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.50,
  totalDays: 25,
  drift: 0.00,
  allowedActions: ['buy_call', 'buy_put', 'sell_call', 'sell_put'],
  winCondition: (pnl) => pnl > 400,
  winText: '盈利超过 $400',
  difficulty: 4,
  tags: ['Straddle', '波动率'],
  phase: 6,
  checklist: [
    { label: '买入 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
    { label: '买入 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
    { label: '盈利 > $400', check: (c) => c.pnl > 400 },
  ],
});
