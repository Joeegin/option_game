/**
 * Level 6 — 卖出 Call (裸卖 / Naked Short Call)
 * Phase 3, difficulty 3. 体验卖方视角与保证金。
 */
LEVEL_DEFINITIONS.push({
  id: 6,
  title: '当一回 Call 的卖方',
  shortTitle: '卖出 Call',
  description: '不买 Call，反过来卖出。立刻收到权利金，但要承担"被行权"的风险。',
  tutorial: `
    <h3 style="color: var(--accent-orange); margin-bottom: 12px;">第六关：卖出 Call (Short Call)</h3>

    <p>前 5 关你都是<strong>买方</strong>——付权利金、赌方向。这一关你换个角色：当<strong>卖方</strong>。</p>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">卖出 Call 是怎么回事</h4>
    <p>你卖出一份 Call → 立刻收到权利金 → 但承担一个义务：<br>
    如果股价涨过行权价，<strong>买方有权按行权价买走你的股票</strong>（你必须按这个价交付）。</p>

    <div class="highlight-box" style="margin: 12px 0;">
      💰 <strong>赌"涨不上去"</strong>：股价 \$100，你卖一份 \$105 Call，收 \$2 权利金。<br>
      → 到期股价 \$103 → Call 作废，你<strong>白赚 \$2</strong>（200/合约）<br>
      → 到期股价 \$120 → 你必须以 \$105 卖出，亏损 = (120-105) - 2 = <strong>\$13/股</strong><br>
      → 股价没上限 → <span style="color: var(--accent-red);">理论亏损无限大</span>
    </div>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">为什么有人愿意卖 Call？</h4>
    <ul style="text-align: left; line-height: 1.8;">
      <li><strong>Theta 收益</strong>：每天时间衰减都是你的收入</li>
      <li><strong>胜率高</strong>：股价没涨过 Call 行权价的概率通常 > 50%</li>
      <li><strong>赚的是权利金</strong>：不需要股价涨跌，<strong>横盘就赢</strong></li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">⚠️ 保证金 (Margin)</h4>
    <p>因为卖 Call 风险无限，券商会<strong>冻结你的资金作为保证金</strong>。在本游戏中：</p>
    <ul style="text-align: left; line-height: 1.8;">
      <li>裸卖 1 份 ATM Call 大约冻结 \$2000-\$2500（按 20% 标的价计算）</li>
      <li>所以即使你账户有 \$10000，可用现金可能只剩 \$7500-\$8000</li>
      <li>这是为了确保你"还得起"潜在亏损</li>
    </ul>

    <h4 style="color: var(--accent-yellow); margin: 14px 0 6px;">本关玩法</h4>
    <ol style="text-align: left; line-height: 1.8; padding-left: 20px;">
      <li>市场温和上涨（drift 偏小），但应该涨不到行权价之上</li>
      <li>选一个<strong>虚值 Call</strong>（行权价高于现价 5-10 美元）</li>
      <li>点 CALL 列的红色 <strong>S</strong> (Sell) 卖出 1 份</li>
      <li>推进到到期，让 Call 作废 → 全额收下权利金</li>
      <li>或者中途看到大幅盈利时平仓（买回 Call）</li>
    </ol>

    <p style="margin-top: 14px; color: var(--text-muted);"><em>💡 持仓面板的 Net Θ 会变成正数 — 时间衰减帮你赚钱了！</em></p>
  `,
  knowledgePanel: `
    <h4>策略：卖出虚值 Call</h4>
    <div class="highlight-box">
      <strong>Short Call</strong> = 卖出 Call<br>
      最大盈利 = 权利金（股价没涨过行权价）<br>
      最大亏损 = <span style="color: var(--accent-red);">理论无限</span>（股价涨过太多）<br>
      盈亏平衡点 = 行权价 + 权利金
    </div>
    <ul>
      <li>当前标的 <strong>{S}</strong>，剩余 <strong>{T}</strong> 天</li>
      <li>建议选 OTM Call（行权价 > 现价）→ 风险更低</li>
      <li>注意保证金占用！现金不足时游戏会拒绝下单</li>
      <li>Net Θ 变成正数 = 你在"收时间租金"</li>
    </ul>
  `,
  initialCash: 12000,
  initialPrice: 100,
  volatility: 0.28,
  totalDays: 25,
  drift: 0.04,
  allowedActions: ['sell_call', 'buy_call'],
  winCondition: (pnl) => pnl > 100,
  winText: '盈利超过 $100',
  difficulty: 3,
  tags: ['Short Call', '卖方'],
  phase: 3,
  checklist: [
    { label: '至少卖出一份 Call', check: (c) => {
      const closed = c.portfolio.getClosedPositions().some(p => !p.isStock && p.optionType === 'call' && !p.isLong);
      return c.portfolio.getPositionSummary().shortCalls > 0 || closed;
    } },
    { label: '盈利 > $100', check: (c) => c.pnl > 100 },
  ],
});
