/**
 * Level 13 — Long Strangle
 * Phase 6. NEW.
 */
LEVEL_DEFINITIONS.push({
  id: 13,
  title: '宽跨式策略',
  shortTitle: 'Strangle',
  description: 'Straddle 的便宜版：买 OTM Call + 买 OTM Put。成本低，但需要更大波动才能盈利。',
  tutorial: `
    <h3 style="color: var(--accent-blue); margin-bottom: 12px;">第十三关：Long Strangle</h3>

    <p>Straddle 用同一个 ATM 行权价，所以两份期权都贵。如果你愿意承担"波动还要更大"的代价，可以用<strong>更便宜的 OTM 期权</strong>组合——这就是 Strangle。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">策略构成</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>腿 1</strong>: 买入 OTM Call (行权价 K₂ > 现价)</li>
      <li><strong>腿 2</strong>: 买入 OTM Put (行权价 K₁ < 现价)</li>
      <li>K₁ < 现价 < K₂，到期日相同</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">Straddle vs Strangle 对比</h4>
    <div class="highlight-box" style="margin: 12px 0;">
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr style="color: var(--text-muted);">
          <td style="padding: 4px 8px;"></td>
          <td style="padding: 4px 8px;">Straddle</td>
          <td style="padding: 4px 8px;">Strangle</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold;">行权价</td>
          <td style="padding: 4px 8px;">Call/Put 同 K (ATM)</td>
          <td style="padding: 4px 8px;">Call K高 + Put K低 (OTM)</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold;">成本</td>
          <td style="padding: 4px 8px;">高</td>
          <td style="padding: 4px 8px;"><span style="color: var(--accent-green);">低</span></td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold;">需要波动</td>
          <td style="padding: 4px 8px;">小</td>
          <td style="padding: 4px 8px;"><span style="color: var(--accent-red);">大</span></td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold;">盈亏区</td>
          <td style="padding: 4px 8px;">V 字形</td>
          <td style="padding: 4px 8px;">U 字形（中间有平底）</td>
        </tr>
      </table>
    </div>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">公式</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li>最大亏损 = Call权利金 + Put权利金</li>
      <li>上方盈亏平衡 = K₂ (Call行权) + 总权利金</li>
      <li>下方盈亏平衡 = K₁ (Put行权) - 总权利金</li>
      <li>盈利区: 股价 > 上方 或 股价 < 下方</li>
      <li><strong>K₁ 到 K₂ 之间是"完全亏损区"</strong>（两份期权都作废）</li>
    </ul>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>💡 看 Payoff 图：Strangle 是 U 字形，底部有一段平底（K₁ 到 K₂ 之间最大亏损）；Straddle 是 V 字形，只有一个最低点。</em></p>
  `,
  knowledgePanel: `
    <h4>策略：Long Strangle</h4>
    <div class="highlight-box">
      <strong>OTM Call + OTM Put</strong><br>
      比 Straddle 便宜，但需要更大波动<br>
      建议 Call 选 +5 / Put 选 -5（或更宽）
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，波动率 <strong>{SIGMA}</strong></li>
      <li>注意右侧 Payoff 图的 <strong>U 字形</strong>，中间有平底</li>
      <li>本关市场预设了较大波动，但方向不定</li>
    </ul>
  `,
  initialCash: 8000,
  initialPrice: 100,
  volatility: 0.55,
  totalDays: 22,
  drift: 0.00,
  allowedActions: ['buy_call', 'buy_put', 'sell_call', 'sell_put'],
  winCondition: (pnl, _, day, portfolio) => {
    // Require at least one OTM Call and OTM Put long
    return pnl > 300;
  },
  winText: '盈利超过 $300',
  difficulty: 4,
  tags: ['Strangle', '波动率'],
  phase: 6,
  checklist: [
    { label: '买入 Call', check: (c) => c.portfolio.getPositionSummary().longCalls > 0 },
    { label: '买入 Put', check: (c) => c.portfolio.getPositionSummary().longPuts > 0 },
    { label: '两腿行权价不同 (Strangle)', check: (c) => {
      const longs = c.portfolio.getPositions().filter(p => !p.isStock && p.isLong);
      const callKs = longs.filter(p => p.optionType === 'call').map(p => p.strike);
      const putKs = longs.filter(p => p.optionType === 'put').map(p => p.strike);
      return callKs.length > 0 && putKs.length > 0 && callKs[0] !== putKs[0];
    } },
    { label: '盈利 > $300', check: (c) => c.pnl > 300 },
  ],
});
