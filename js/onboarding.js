/**
 * Onboarding — 4-page interactive intro for complete beginners.
 * Must be completed once before Level 1 unlocks.
 */
const ONBOARDING_PAGES = [
  // Page 1
  {
    title: '什么是期权？',
    icon: '🎫',
    content: `
      <p style="font-size: 16px;">期权 (Option) 是一张<strong>权利凭证</strong>——给你一个"在未来按约定价交易"的<strong>权利</strong>，但不是义务。</p>

      <div class="onb-analogy">
        <h4>🏠 类比：买房定金</h4>
        <p>你看中一套 100 万的房子，担心半年内房价上涨。你付 <strong>1 万定金</strong>，约定半年内可以按 100 万买入。</p>
        <ul>
          <li>半年后房价涨到 <strong>120 万</strong> → 你按 100 万买入，立刻赚 19 万 ✅</li>
          <li>半年后房价跌到 <strong>80 万</strong> → 你放弃，损失就是 1 万定金 ⚠️</li>
        </ul>
        <p>这就是<strong>看涨期权 (Call Option)</strong> 的本质——花小钱锁定大资产的潜在收益。</p>
      </div>

      <div class="onb-analogy">
        <h4>🛡 类比：买车险</h4>
        <p>你买一辆车，担心被刮蹭。每年付 <strong>2000 元保费</strong>，保额 10 万。</p>
        <ul>
          <li>车被刮了 → 保险赔付 ✅</li>
          <li>没出事 → 保费白付 ⚠️</li>
        </ul>
        <p>这就是<strong>看跌期权 (Put Option)</strong> 的本质——花保费换"价格下跌时的赔付权"。</p>
      </div>

      <p style="margin-top: 16px; color: var(--text-muted);">⏭ 下一页：期权的 4 个核心要素</p>
    `,
  },

  // Page 2
  {
    title: '期权的 4 个核心要素',
    icon: '🧩',
    content: `
      <p>每张期权合约都由这 4 个要素决定：</p>

      <div class="onb-elements">
        <div class="onb-element">
          <div class="onb-element-num">1</div>
          <div class="onb-element-body">
            <strong>标的资产 (Underlying)</strong><br>
            合约对应的是<strong>哪只股票</strong>。如苹果 (AAPL) 期权对应苹果股票。
          </div>
        </div>
        <div class="onb-element">
          <div class="onb-element-num">2</div>
          <div class="onb-element-body">
            <strong>行权价 (Strike Price)</strong><br>
            合约约定的<strong>交易价格</strong>。例如 \$100 Call = "以 \$100 买入的权利"。
          </div>
        </div>
        <div class="onb-element">
          <div class="onb-element-num">3</div>
          <div class="onb-element-body">
            <strong>到期日 (Expiration)</strong><br>
            合约的<strong>有效期</strong>。过了就失效，类似机票退改险只在出行前生效。
          </div>
        </div>
        <div class="onb-element">
          <div class="onb-element-num">4</div>
          <div class="onb-element-body">
            <strong>权利金 (Premium)</strong><br>
            <strong>买方付给卖方的费用</strong>，即期权的市场价。涨跌每分每秒在变。
          </div>
        </div>
      </div>

      <div class="onb-tip">
        ⚠️ <strong>1 份合约 = 100 股</strong><br>
        所有报价都是"每股价格"，但实际交易乘 100 倍。<br>
        看到 Call 标 \$3.00 → 实际买入花 \$300（控制 100 股）。
      </div>

      <p style="margin-top: 16px; color: var(--text-muted);">⏭ 下一页：Call vs Put 直觉对比</p>
    `,
  },

  // Page 3
  {
    title: 'Call vs Put — 一张图记住',
    icon: '⚖️',
    content: `
      <p>期权只有两类。记住一句话：</p>

      <div class="onb-headline">
        <strong style="color: var(--accent-green);">看涨买 Call</strong> · <strong style="color: var(--accent-red);">看跌买 Put</strong>
      </div>

      <div class="onb-comparison">
        <div class="onb-comparison-col" style="border-color: var(--accent-green);">
          <div class="onb-col-title" style="color: var(--accent-green);">📈 CALL (看涨)</div>
          <ul>
            <li>买入 = "锁定<strong>买入价</strong>的权利"</li>
            <li>股价<strong>涨</strong>就赚</li>
            <li>盈亏平衡 = 行权价 + 权利金</li>
            <li>最大亏损 = 权利金</li>
            <li>最大盈利 = <strong>无上限</strong></li>
          </ul>
        </div>
        <div class="onb-comparison-col" style="border-color: var(--accent-red);">
          <div class="onb-col-title" style="color: var(--accent-red);">📉 PUT (看跌)</div>
          <ul>
            <li>买入 = "锁定<strong>卖出价</strong>的权利"</li>
            <li>股价<strong>跌</strong>就赚</li>
            <li>盈亏平衡 = 行权价 - 权利金</li>
            <li>最大亏损 = 权利金</li>
            <li>最大盈利 = 行权价 - 权利金</li>
          </ul>
        </div>
      </div>

      <div class="onb-tip">
        💡 <strong>"买"和"卖"是两个独立维度</strong><br>
        你可以买 Call、卖 Call、买 Put、卖 Put — 总共 4 种基础操作。<br>
        游戏前几关只做"买"，到 Phase 3 才会让你体验"卖"。
      </div>

      <p style="margin-top: 16px; color: var(--text-muted);">⏭ 下一页：界面导览</p>
    `,
  },

  // Page 4
  {
    title: '界面导览',
    icon: '🗺',
    content: `
      <p>进入关卡后，你会看到一个交易仪表盘。先认识各个区域：</p>

      <div class="onb-ui-map">
        <div class="onb-region">
          <div class="onb-region-label" style="background: rgba(68, 138, 255, 0.2);">📋 左侧：期权链</div>
          <p>显示当前股价附近所有行权价的 Call 和 Put 报价。<br>
          每行有买价 (Bid) / 卖价 (Ask)，蓝色高亮行 = ATM (最接近现价)。<br>
          点击绿色 <strong>B</strong> 买入，点击红色 <strong>S</strong> 卖出。</p>
        </div>
        <div class="onb-region">
          <div class="onb-region-label" style="background: rgba(255, 215, 64, 0.2);">📖 中上：知识讲解</div>
          <p>当前关卡的教程、策略指引、<strong>到期盈亏图 (Payoff)</strong>、通关进度。<br>
          交易过程中可以随时看。</p>
        </div>
        <div class="onb-region">
          <div class="onb-region-label" style="background: rgba(0, 200, 83, 0.2);">📈 中下：价格图表</div>
          <p>股价随时间的走势。开仓时会有三角标记。<br>
          每按一次 <strong>下一日</strong>，图表向前推进一天。</p>
        </div>
        <div class="onb-region">
          <div class="onb-region-label" style="background: rgba(255, 145, 0, 0.2);">📦 右侧：持仓面板</div>
          <p>当前持有的所有期权/股票。<br>
          顶部是 <strong>Net Greeks 横条</strong> (Δ/Γ/Θ/ν)。<br>
          每个持仓卡片显示盈亏，可一键平仓。</p>
        </div>
        <div class="onb-region">
          <div class="onb-region-label" style="background: rgba(138, 143, 163, 0.2);">⌨️ 底部：交易栏</div>
          <p>数量输入（默认 1，可改）。<br>
          <strong>下一日 ▶</strong> 推进一天，<strong>+5</strong> 推进 5 天，<strong>到期</strong> 直接跳到到期。<br>
          <strong>快捷键</strong>：空格 = 下一日，1-9 数字键 = 设置数量，Esc = 关弹窗。</p>
        </div>
      </div>

      <p style="margin-top: 16px; color: var(--accent-green); font-size: 16px; text-align: center;">
        <strong>🎉 准备好了！点下面的按钮开始第一关。</strong>
      </p>
    `,
  },
];

const Onboarding = {
  STORAGE_KEY: 'optionGameOnboarding',

  isCompleted() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'done';
    } catch (e) {
      return false;
    }
  },

  markCompleted() {
    try {
      localStorage.setItem(this.STORAGE_KEY, 'done');
    } catch (e) {
      // ignore
    }
  },

  reset() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  },
};
