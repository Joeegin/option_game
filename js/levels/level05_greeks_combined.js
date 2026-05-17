/**
 * Level 5 — Greeks 综合
 * Phase 2. 把 Theta/Vega/Delta 三者一起看。
 */
LEVEL_DEFINITIONS.push({
  id: 5,
  title: '把 Greeks 串起来',
  shortTitle: 'Greeks 综合',
  description: '前两关单独感受了 Theta 和 Vega。本关把 Delta/Gamma/Theta/Vega 一起观察并实战。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第五关：期权价格的五大驱动因素 (Greeks)</h3>

    <p>期权价格不像股票那么简单——它受多个变量同时影响。这些变量的<strong>敏感度</strong>就是 Greeks。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">1. Delta (δ) — 方向敞口</h4>
    <p>股价每变动 \$1，期权价格变动多少。</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>Call Delta: 0 到 +1（ATM 约 +0.5）</li>
      <li>Put Delta: -1 到 0（ATM 约 -0.5）</li>
      <li>Delta = "等效股票数"，比如 +0.5 的 Call 相当于持 50 股</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">2. Gamma (γ) — Delta 的"加速度"</h4>
    <p>股价变动时 Delta 变化的速度。ATM 时最大。</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>Gamma 大 = 涨了赚得快、跌了亏得也快</li>
      <li>买方喜欢正 Gamma，卖方承担负 Gamma 风险</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">3. Theta (θ) — 时间衰减（第 3 关已学）</h4>
    <p>每天损失/获得的时间价值。买方 Theta 为负，卖方 Theta 为正。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">4. Vega (ν) — 波动率敏感（第 4 关已学）</h4>
    <p>波动率每变 1% 价格变多少。买方 Vega 为正，卖方为负。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">5. Rho (ρ) — 利率敏感（实战不重要）</h4>
    <p>短期期权 Rho 影响小，通常可以忽略。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法</h4>
    <p>市场温和波动，可以买 Call 也可以买 Put。盯着持仓面板顶部的 <strong>Net Greeks 横条</strong>：</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>每开一仓 → 看 Δ/Γ/Θ/ν 怎么变</li>
      <li>买 Call → Δ 增加、Θ 减少（负方向）、ν 增加</li>
      <li>买 Put → Δ 减少（负值）、Θ 减少、ν 增加</li>
      <li>同时买 Call+Put → Δ 接近 0（中性），Θ 双倍消耗，ν 双倍敞口</li>
    </ul>
  `,
  knowledgePanel: `
    <h4>策略：综合运用 Greeks</h4>
    <div class="highlight-box">
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr style="color: var(--text-muted);">
          <td style="padding: 3px 8px;"></td>
          <td style="padding: 3px 8px; text-align: center;">Δ</td>
          <td style="padding: 3px 8px; text-align: center;">Γ</td>
          <td style="padding: 3px 8px; text-align: center;">Θ</td>
          <td style="padding: 3px 8px; text-align: center;">ν</td>
        </tr>
        <tr>
          <td style="padding: 3px 8px; color: var(--accent-green); font-weight: bold;">ATM Call</td>
          <td style="padding: 3px 8px; text-align: center;">{CALL_DELTA}</td>
          <td style="padding: 3px 8px; text-align: center;">{CALL_GAMMA}</td>
          <td style="padding: 3px 8px; text-align: center; color: var(--accent-red);">{CALL_THETA}</td>
          <td style="padding: 3px 8px; text-align: center;">{CALL_VEGA}</td>
        </tr>
        <tr>
          <td style="padding: 3px 8px; color: var(--accent-red); font-weight: bold;">ATM Put</td>
          <td style="padding: 3px 8px; text-align: center;">{PUT_DELTA}</td>
          <td style="padding: 3px 8px; text-align: center;">{PUT_GAMMA}</td>
          <td style="padding: 3px 8px; text-align: center; color: var(--accent-red);">{PUT_THETA}</td>
          <td style="padding: 3px 8px; text-align: center;">{PUT_VEGA}</td>
        </tr>
      </table>
    </div>
    <ul>
      <li>标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天，σ = <strong>{SIGMA}</strong></li>
      <li>盯紧持仓面板顶部 <strong>Net Greeks 横条</strong>，每次交易后观察变化</li>
    </ul>
  `,
  initialCash: 10000,
  initialPrice: 100,
  volatility: 0.30,
  totalDays: 30,
  drift: 0.02,
  allowedActions: ['buy_call', 'buy_put'],
  winCondition: (pnl) => pnl > 150,
  winText: '盈利超过 $150',
  difficulty: 2,
  tags: ['Greeks', '综合'],
  phase: 2,
  checklist: [
    { label: '盈利 > $150', check: (c) => c.pnl > 150 },
  ],
});
