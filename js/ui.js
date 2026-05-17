/**
 * UI Manager
 * Handles all DOM rendering and user interaction.
 */
class UI {
  constructor() {
    this.app = document.getElementById('app');
    this.onTrade = null;
    this.onAdvanceDay = null;
    this.onAdvanceDays = null;
    this.onStartLevel = null;
    this.onSelectLevel = null;
    this.onClosePosition = null;
    this.onResetGame = null;

    this._delegationBound = false;
    this._bindGlobalDelegation();
  }

  // ─── Event delegation (avoids inline onclick) ───

  _bindGlobalDelegation() {
    if (this._delegationBound) return;
    this._delegationBound = true;

    this.app.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;

      switch (action) {
        case 'trade': {
          const tradeAction = target.dataset.tradeAction;
          const strike = parseFloat(target.dataset.strike || '0');
          this._handleTrade(tradeAction, strike);
          break;
        }
        case 'close-position': {
          const id = parseInt(target.dataset.positionId, 10);
          this._handleClose(id);
          break;
        }
        case 'select-level': {
          const id = parseInt(target.dataset.level, 10);
          if (this.onSelectLevel) this.onSelectLevel(id);
          break;
        }
        case 'reset':
          this.handleReset();
          break;
        case 'start-level':
          if (this.onStartLevel) this.onStartLevel();
          break;
        case 'advance-day':
          if (this.onAdvanceDay) this.onAdvanceDay();
          break;
        case 'advance-days': {
          const n = parseInt(target.dataset.days, 10);
          if (this.onAdvanceDays) this.onAdvanceDays(n);
          break;
        }
        case 'open-onboarding':
          this.renderOnboarding(0);
          break;
        case 'onboarding-next': {
          const next = parseInt(target.dataset.page, 10);
          this.renderOnboarding(next);
          break;
        }
        case 'onboarding-skip':
          if (typeof Onboarding !== 'undefined') Onboarding.markCompleted();
          if (this.onSkipOnboarding) this.onSkipOnboarding();
          break;
        case 'onboarding-finish':
          if (typeof Onboarding !== 'undefined') Onboarding.markCompleted();
          if (this.onFinishOnboarding) this.onFinishOnboarding();
          break;
        case 'switch-chart-tab': {
          const tab = target.dataset.tab;
          this._switchChartTab(tab);
          break;
        }
      }
    });
  }

  _switchChartTab(tab) {
    const tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    const pricePane = document.getElementById('chart-pane-price');
    const payoffPane = document.getElementById('chart-pane-payoff');
    if (!pricePane || !payoffPane) return;
    if (tab === 'price') {
      pricePane.hidden = false;
      pricePane.classList.add('active');
      payoffPane.hidden = true;
      payoffPane.classList.remove('active');
      // Trigger chart redraw because canvas was hidden
      if (this.onRedrawChart) this.onRedrawChart();
    } else {
      pricePane.hidden = true;
      pricePane.classList.remove('active');
      payoffPane.hidden = false;
      payoffPane.classList.add('active');
      // Re-render payoff in case positions changed while hidden
      this._refreshPayoffMount();
    }
  }

  _refreshPayoffMount() {
    const mount = document.getElementById('payoff-mount');
    if (!mount) return;
    const portfolio = window.app && window.app.portfolio;
    const market = window.app && window.app.market;
    if (!portfolio || !market) return;
    const positions = portfolio.getPositions();
    if (positions.length === 0) {
      mount.innerHTML = `<div class="payoff-empty">开仓后这里会显示你的盈亏曲线 📊</div>`;
      return;
    }
    if (typeof PayoffDiagram === 'undefined') return;
    const S = market.getCurrentPrice();
    const T = Math.max(market.getDaysRemaining() / 365, 0.001);
    PayoffDiagram.render(mount, positions, S, market.volatility, T);
  }

  // ─── Onboarding (Prologue) ───

  renderOnboarding(pageIndex) {
    if (typeof ONBOARDING_PAGES === 'undefined') return;
    const page = ONBOARDING_PAGES[pageIndex];
    if (!page) return;
    const total = ONBOARDING_PAGES.length;
    const dots = ONBOARDING_PAGES.map((_, i) => `<span class="onb-dot ${i === pageIndex ? 'active' : ''}"></span>`).join('');
    const isLast = pageIndex === total - 1;

    this.app.innerHTML = `
      <div class="onboarding-screen">
        <div class="onb-card">
          <div class="onb-header">
            <div class="onb-icon">${page.icon}</div>
            <div class="onb-title">${page.title}</div>
            <div class="onb-step">第 ${pageIndex + 1} 页 / ${total}</div>
          </div>
          <div class="onb-content">${page.content}</div>
          <div class="onb-footer">
            <div class="onb-dots">${dots}</div>
            <div class="onb-actions">
              <button data-action="onboarding-skip" class="onb-skip">跳过</button>
              ${isLast
                ? `<button data-action="onboarding-finish" class="onb-finish">🚀 开始第一关</button>`
                : `<button data-action="onboarding-next" data-page="${pageIndex + 1}" class="onb-next">下一页 →</button>`}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ─── Level Select Screen ───

  renderLevelSelect(levels, game) {
    const progress = game.getProgress();
    const onbDone = typeof Onboarding !== 'undefined' ? Onboarding.isCompleted() : true;

    const renderCard = (level) => {
      const unlocked = game.isUnlocked(level.id);
      const completed = game.isCompleted(level.id);
      let cls = '';
      if (completed) cls = 'completed';
      else if (!unlocked) cls = 'locked';

      const stars = '★'.repeat(level.difficulty || 1) + '☆'.repeat(5 - (level.difficulty || 1));
      const tags = (level.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
      const clickable = unlocked ? `data-action="select-level" data-level="${level.id}"` : '';

      return `
        <div class="level-card ${cls}" ${clickable}>
          <div class="card-level">${unlocked ? level.id : '🔒'}</div>
          <div class="card-title">${level.shortTitle}</div>
          ${unlocked ? `<div class="card-stars" title="难度">${stars}</div>` : ''}
          ${unlocked && tags ? `<div class="card-tags">${tags}</div>` : ''}
        </div>`;
    };

    // Group by phase if game provides it
    let groupsHtml;
    if (typeof game.getLevelsByPhase === 'function') {
      const phases = game.getLevelsByPhase();
      groupsHtml = phases.map(phase => `
        <div class="phase-group">
          <div class="phase-header">
            <div class="phase-title">${phase.title}</div>
            <div class="phase-desc">${phase.desc || ''}</div>
          </div>
          <div class="level-grid">${phase.levels.map(renderCard).join('')}</div>
        </div>
      `).join('');
    } else {
      groupsHtml = `<div class="level-grid">${levels.map(renderCard).join('')}</div>`;
    }

    const prologueBanner = !onbDone
      ? `
        <div class="prologue-banner">
          <div class="pb-left">
            <div class="pb-icon">📚</div>
            <div>
              <div class="pb-title">先学新手序章</div>
              <div class="pb-desc">4 页互动导引——读完后即可解锁第 1 关</div>
            </div>
          </div>
          <button class="pb-cta" data-action="open-onboarding">开始序章 →</button>
        </div>`
      : `
        <div class="prologue-banner subtle">
          <div class="pb-left">
            <div class="pb-icon">✅</div>
            <div>
              <div class="pb-title">序章已完成</div>
              <div class="pb-desc">想重温基础概念？随时可以重新阅读</div>
            </div>
          </div>
          <button class="pb-cta-secondary" data-action="open-onboarding">重温序章</button>
        </div>`;

    this.app.innerHTML = `
      <div class="level-select">
        <h1>期权交易教程</h1>
        <p class="subtitle">
          从零开始学习期权交易 · ${progress.completed}/${progress.total} 关已完成
        </p>
        ${prologueBanner}
        ${groupsHtml}
        <div style="margin-top: 24px;">
          <button data-action="reset" style="color: var(--text-muted); font-size: 12px; background: transparent; border-color: transparent;">
            重置进度
          </button>
        </div>
      </div>`;
  }

  // ─── Dashboard (game screen) ───

  renderGame(level, market, portfolio, game) {
    this.app.innerHTML = `
      <div class="top-bar">
        <div class="level-info">
          <span class="level-badge">关卡 ${level.id}</span>
          <span style="font-size: 14px;">${level.title}</span>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-label">资金</div>
            <div class="stat-value" id="stat-cash">$${portfolio.getCash().toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总盈亏</div>
            <div class="stat-value" id="stat-pnl">--</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">剩余天数</div>
            <div class="stat-value" id="stat-days">${market.getDaysRemaining()} / ${market.getTotalDays()}</div>
          </div>
        </div>
      </div>
      <div class="dashboard">
        <div class="panel" id="panel-chain">
          <div class="panel-header">期权链</div>
          <div class="panel-content" id="chain-content"></div>
        </div>
        <div class="middle-area">
          <div class="knowledge-panel" id="knowledge-panel">
            <div class="kp-header">
              <span>知识讲解</span>
              <span style="font-size: 11px; color: var(--text-muted);" id="kp-level-label"></span>
            </div>
            <div class="kp-content" id="kp-content"></div>
            <div class="kp-footer" id="kp-footer" style="display: none;"></div>
          </div>
          <div class="chart-area" id="chart-area">
            <div class="chart-tabs">
              <button class="chart-tab active" data-action="switch-chart-tab" data-tab="price">📈 价格走势</button>
              <button class="chart-tab" data-action="switch-chart-tab" data-tab="payoff">💰 到期盈亏</button>
            </div>
            <div class="chart-pane chart-pane-price active" id="chart-pane-price">
              <canvas id="price-chart"></canvas>
            </div>
            <div class="chart-pane chart-pane-payoff" id="chart-pane-payoff" hidden>
              <div class="payoff-toolbar">
                <div class="payoff-legend">
                  <span class="lg-item"><i class="lg-line lg-expiry"></i>到期盈亏</span>
                  <span class="lg-item"><i class="lg-line lg-now"></i>当前盈亏</span>
                  <span class="lg-item"><i class="lg-tick lg-be"></i>盈亏平衡 BE</span>
                  <span class="lg-item"><i class="lg-tick lg-price"></i>现价</span>
                </div>
                <span class="payoff-help-trigger" tabindex="0">
                  ❓ 如何看图
                  <div class="payoff-help-tooltip" role="tooltip">
                    <div class="ht-section">
                      <div class="ht-title">📐 坐标</div>
                      <div><strong>X 轴</strong>: 到期日时的股价</div>
                      <div><strong>Y 轴</strong>: 你的盈亏 (美元)</div>
                    </div>
                    <div class="ht-section">
                      <div class="ht-title">🎨 线条含义</div>
                      <div><span class="ht-swatch lg-expiry"></span><strong>蓝实线</strong> = <strong>到期</strong>盈亏曲线 (合约到期日的盈亏)</div>
                      <div><span class="ht-swatch lg-now"></span><strong>灰虚线</strong> = <strong>当前</strong>盈亏 (现在平仓的盈亏，含时间价值)</div>
                      <div><span class="ht-swatch lg-be"></span><strong>黄竖虚线</strong> = <strong>盈亏平衡点</strong> (这里盈亏为 0)</div>
                      <div><span class="ht-swatch lg-price"></span><strong>蓝竖虚线</strong> = <strong>当前股价</strong> (现在的位置)</div>
                    </div>
                    <div class="ht-section">
                      <div class="ht-title">🔍 怎么解读</div>
                      <div>1. 找到当前股价的竖虚线</div>
                      <div>2. 看它和蓝实线交点的 Y 值 → 到期盈亏估算</div>
                      <div>3. 看它和灰虚线交点 → 现在平仓的盈亏</div>
                      <div>4. 蓝实线上方 0 线以上 = 盈利区</div>
                    </div>
                    <div class="ht-section">
                      <div class="ht-title">📊 形状对照表</div>
                      <div><strong>↗</strong> 单买 Call (线性盈利，无上限)</div>
                      <div><strong>↘</strong> 单买 Put (线性盈利，跌得越多越赚)</div>
                      <div><strong>┌─┐</strong> Bull Call Spread (有顶有底)</div>
                      <div><strong>V</strong> Straddle (中间最差，两侧赚)</div>
                      <div><strong>U</strong> Strangle (中间平底亏，两侧赚)</div>
                      <div><strong>▲</strong> Butterfly (中间尖顶，两侧归零)</div>
                      <div><strong>┏━┓</strong> Iron Condor (中间宽顶赚，两侧封顶亏)</div>
                    </div>
                  </div>
                </span>
              </div>
              <div id="payoff-mount" class="payoff-mount">
                <div class="payoff-empty">开仓后这里会显示你的盈亏曲线 📊</div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel" id="panel-positions">
          <div class="panel-header">持仓</div>
          <div id="net-greeks-bar"></div>
          <div class="panel-content" id="positions-content"></div>
        </div>
      </div>
      <div class="trade-panel" id="trade-panel">
        <div class="trade-buttons" id="trade-buttons"></div>
        <div class="trade-inputs" id="trade-inputs"></div>
        <div class="advance-buttons">
          <button data-action="advance-day" id="btn-advance" class="btn-primary">下一日 ▶</button>
          <button data-action="advance-days" data-days="5" class="btn-secondary" title="快进 5 天">+5 ⏩</button>
          <button data-action="advance-days" data-days="999" class="btn-secondary" title="跳到到期">到期 ⏭</button>
        </div>
      </div>`;

    this._renderOptionsChain(market, level);
    this._renderPositions(portfolio, market);
    this._renderKnowledgePanel(level, market, game);
    this._renderTradeButtons(level);
    this._updateStats(portfolio, market);
  }

  updateDashboard(level, market, portfolio, game) {
    this._renderOptionsChain(market, level);
    this._renderPositions(portfolio, market);
    this._renderKnowledgePanel(level, market, game);
    this._renderTradeButtons(level);
    this._updateStats(portfolio, market);

    const daysEl = document.getElementById('stat-days');
    if (daysEl) {
      daysEl.textContent = `${market.getDaysRemaining()} / ${market.getTotalDays()}`;
    }
    const cashEl = document.getElementById('stat-cash');
    if (cashEl) {
      cashEl.textContent = '$' + portfolio.getCash().toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
  }

  _renderOptionsChain(market, level) {
    const container = document.getElementById('chain-content');
    if (!container) return;

    const chain = market.getOptionsChain();
    const currentPrice = market.getCurrentPrice();
    const daysLeft = market.getDaysRemaining();

    let html = `
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px; padding: 0 5px; line-height: 1.6;">
        <span>标的价格: <strong style="color: var(--text-primary);">$${currentPrice.toFixed(2)}</strong></span>
        <span style="margin-left: 10px;">剩余: <strong>${daysLeft}</strong> 天</span>
        <span style="margin-left: 10px;">蓝色行 = <strong style="color: var(--accent-blue);">ATM</strong></span>
      </div>
      <table class="options-chain">
        <thead>
          <tr>
            <th colspan="3" style="text-align: center; color: var(--accent-green);">CALL (看涨)</th>
            <th>行权价</th>
            <th colspan="3" style="text-align: center; color: var(--accent-red);">PUT (看跌)</th>
          </tr>
          <tr>
            <th>买价</th><th>卖价</th><th></th>
            <th></th>
            <th></th><th>买价</th><th>卖价</th>
          </tr>
        </thead>
        <tbody>`;

    for (const opt of chain) {
      const isATM = opt.isATM;
      html += `<tr class="${isATM ? 'selected' : ''}" data-strike="${opt.strike}">
        <td style="color: var(--accent-green);">${opt.callBid}</td>
        <td style="color: var(--accent-green);">${opt.callAsk}</td>
        <td>`;

      if (level.allowedActions.includes('buy_call') || level.allowedActions.includes('sell_call')) {
        html += `<div class="action-btns">`;
        if (level.allowedActions.includes('buy_call')) {
          html += `<button class="buy" data-action="trade" data-trade-action="buy_call" data-strike="${opt.strike}">B</button>`;
        }
        if (level.allowedActions.includes('sell_call')) {
          html += `<button class="sell" data-action="trade" data-trade-action="sell_call" data-strike="${opt.strike}">S</button>`;
        }
        html += `</div>`;
      }

      html += `</td>
        <td style="font-weight: bold; ${isATM ? 'color: var(--accent-blue);' : ''}">$${opt.strike}</td>
        <td>`;

      if (level.allowedActions.includes('buy_put') || level.allowedActions.includes('sell_put')) {
        html += `<div class="action-btns">`;
        if (level.allowedActions.includes('buy_put')) {
          html += `<button class="buy" data-action="trade" data-trade-action="buy_put" data-strike="${opt.strike}">B</button>`;
        }
        if (level.allowedActions.includes('sell_put')) {
          html += `<button class="sell" data-action="trade" data-trade-action="sell_put" data-strike="${opt.strike}">S</button>`;
        }
        html += `</div>`;
      }

      html += `</td>
        <td style="color: var(--accent-red);">${opt.putBid}</td>
        <td style="color: var(--accent-red);">${opt.putAsk}</td>
      </tr>`;
    }

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  _renderPositions(portfolio, market) {
    const container = document.getElementById('positions-content');
    const greeksBar = document.getElementById('net-greeks-bar');
    if (!container) return;

    const positions = portfolio.getPositions();
    const price = market.getCurrentPrice();
    const daysLeft = market.getDaysRemaining();
    const T = Math.max(daysLeft / 365, 0.001);

    if (greeksBar) {
      if (positions.length === 0) {
        greeksBar.innerHTML = '';
      } else {
        const net = this._calcNetGreeks(positions, price, T, market.volatility);
        greeksBar.innerHTML = `
          <div class="net-greeks">
            <div class="ng-item" title="组合 Delta (方向敞口)">
              <span class="ng-label">Δ</span>
              <span class="ng-val ${net.delta >= 0 ? 'text-green' : 'text-red'}">${net.delta.toFixed(2)}</span>
            </div>
            <div class="ng-item" title="组合 Theta (每天时间衰减)">
              <span class="ng-label">Θ</span>
              <span class="ng-val ${net.theta >= 0 ? 'text-green' : 'text-red'}">${net.theta.toFixed(2)}</span>
            </div>
            <div class="ng-item" title="组合 Vega (波动率敏感)">
              <span class="ng-label">ν</span>
              <span class="ng-val ${net.vega >= 0 ? 'text-green' : 'text-red'}">${net.vega.toFixed(2)}</span>
            </div>
            <div class="ng-item" title="组合 Gamma (Delta变动率)">
              <span class="ng-label">Γ</span>
              <span class="ng-val">${net.gamma.toFixed(3)}</span>
            </div>
          </div>`;
      }
    }

    if (positions.length === 0) {
      container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
        暂无持仓<br><small>在期权链中点击 B(买入) 或 S(卖出)</small>
      </div>`;
      return;
    }

    let html = '';
    for (const pos of positions) {
      const currentPrice = pos.isStock ? price : market.getOptionPrice(pos.optionType, pos.strike).mid;
      const multiplier = pos.isStock ? 1 : 100;
      let pnl;
      if (pos.isLong) {
        pnl = (currentPrice - pos.entryPremium) * pos.quantity * multiplier;
      } else {
        pnl = (pos.entryPremium - currentPrice) * pos.quantity * multiplier;
      }
      const pnlClass = pnl >= 0 ? 'text-green' : 'text-red';
      const typeLabel = pos.isStock ? 'STOCK' : (pos.optionType.toUpperCase());
      const direction = pos.isLong ? 'long' : 'short';

      html += `
        <div class="position-card fade-in">
          <div class="pos-header">
            <span class="pos-type ${direction}">${pos.isLong ? '买入' : '卖出'} ${pos.quantity} ${typeLabel}</span>
            <span class="${pnlClass}" style="font-weight: bold;">$${pnl.toFixed(2)}</span>
          </div>
          <div class="pos-details">
            ${pos.isStock ? '' : `<span>行权价: $${pos.strike}</span>`}
            <span>入场价: $${pos.entryPremium.toFixed(2)}</span>
            ${pos.isStock ? '' : `<span>现价: $${currentPrice.toFixed(2)}</span>`}
            <span>数量: ${pos.quantity}</span>
          </div>
          <button class="close-btn" data-action="close-position" data-position-id="${pos.id}">平仓</button>
        </div>`;
    }

    container.innerHTML = html;
  }

  _calcNetGreeks(positions, S, T, sigma) {
    let delta = 0, gamma = 0, theta = 0, vega = 0;
    for (const pos of positions) {
      if (pos.isStock) {
        delta += (pos.isLong ? 1 : -1) * pos.quantity;
        continue;
      }
      const g = calculateGreeks(pos.optionType, S, pos.strike, T, 0.03, sigma);
      const sign = pos.isLong ? 1 : -1;
      const qtyMul = pos.quantity * 100;
      delta += sign * g.delta * pos.quantity;
      gamma += sign * g.gamma * pos.quantity;
      theta += sign * g.theta * qtyMul;
      vega += sign * g.vega * qtyMul;
    }
    return { delta, gamma, theta, vega };
  }

  _renderKnowledgePanel(level, market, game) {
    const label = document.getElementById('kp-level-label');
    const content = document.getElementById('kp-content');
    const footer = document.getElementById('kp-footer');
    if (!label || !content) return;

    const S = market.getCurrentPrice();
    const daysLeft = market.getDaysRemaining();
    const T = daysLeft / 365;
    const sigma = market.volatility;
    const atmCall = blackScholes('call', S, S, T, 0.03, sigma);
    const atmPut = blackScholes('put', S, S, T, 0.03, sigma);

    const isPlaying = game.getState() === 'playing';
    label.textContent = `关卡 ${level.id} — ${level.title}`;

    if (!isPlaying) {
      content.innerHTML = `<div class="tutorial-full">${level.tutorial}</div>`;
      footer.style.display = '';
      footer.innerHTML = `
        <div class="kp-start-area">
          <div class="objective-badge">目标：${level.winText}</div>
          <button class="btn-start-trading" data-action="start-level">开始交易</button>
        </div>`;
    } else {
      const info = level.knowledgePanel || '';

      const greeksCall = calculateGreeks('call', S, S, T, 0.03, sigma);
      const greeksPut = calculateGreeks('put', S, S, T, 0.03, sigma);

      const guide = info
        .replace(/\{S\}/g, '$' + S.toFixed(2))
        .replace(/\{T\}/g, daysLeft.toString())
        .replace(/\{ATM_CALL\}/g, '$' + atmCall.toFixed(2))
        .replace(/\{ATM_PUT\}/g, '$' + atmPut.toFixed(2))
        .replace(/\{SIGMA\}/g, (sigma * 100).toFixed(0) + '%')
        .replace(/\{CALL_DELTA\}/g, greeksCall.delta.toFixed(4))
        .replace(/\{CALL_GAMMA\}/g, greeksCall.gamma.toFixed(4))
        .replace(/\{CALL_THETA\}/g, greeksCall.theta.toFixed(4))
        .replace(/\{CALL_VEGA\}/g, greeksCall.vega.toFixed(4))
        .replace(/\{PUT_DELTA\}/g, greeksPut.delta.toFixed(4))
        .replace(/\{PUT_GAMMA\}/g, greeksPut.gamma.toFixed(4))
        .replace(/\{PUT_THETA\}/g, greeksPut.theta.toFixed(4))
        .replace(/\{PUT_VEGA\}/g, greeksPut.vega.toFixed(4));

      // Build win-progress checklist
      const progressHtml = this._buildWinProgress(level, game, market);

      content.innerHTML = `
        <div class="kp-guide-box">${guide}</div>
        ${progressHtml}
        <div class="kp-hint">💡 切换到下方 <strong>"💰 到期盈亏"</strong> 标签可查看你的盈亏曲线</div>
        <details class="kp-tutorial-details">
          <summary>完整教程</summary>
          <div class="tutorial-full">${level.tutorial}</div>
        </details>`;

      footer.style.display = 'none';
    }
    // Always refresh the Payoff mount (Tab pane lives outside knowledge-panel now)
    this._refreshPayoffMount();
  }

  _buildWinProgress(level, game, market) {
    if (!level.checklist) return '';
    const portfolio = window.app && window.app.portfolio;
    if (!portfolio) return '';
    const ctx = {
      pnl: portfolio.getTotalPnL((pos) => pos.isStock ? market.getCurrentPrice() : market.getOptionPrice(pos.optionType, pos.strike).mid),
      day: market.getDay(),
      portfolio,
      market,
    };
    const items = level.checklist.map(item => {
      const done = !!item.check(ctx);
      return `<li class="${done ? 'done' : 'pending'}">${done ? '✅' : '⏳'} ${item.label}</li>`;
    }).join('');
    return `<div class="win-progress"><div class="wp-title">策略路径 / 通关检查</div><ul>${items}</ul></div>`;
  }

  _renderTradeButtons(level) {
    const container = document.getElementById('trade-buttons');
    if (!container) return;

    const allowed = level.allowedActions;
    let html = '';

    if (allowed.includes('buy_stock')) {
      html += `<button class="buy" data-action="trade" data-trade-action="buy_stock" data-strike="0">买入股票</button>`;
    }
    if (allowed.includes('sell_stock')) {
      html += `<button class="sell" data-action="trade" data-trade-action="sell_stock" data-strike="0">卖出股票</button>`;
    }

    container.innerHTML = html;

    const inputsContainer = document.getElementById('trade-inputs');
    if (inputsContainer) {
      inputsContainer.innerHTML = `
        <label>数量</label>
        <input type="number" id="trade-qty" value="1" min="1" max="100" style="width: 60px;">
        <div class="qty-presets">
          <button class="qty-preset" data-qty="1">1</button>
          <button class="qty-preset" data-qty="5">5</button>
          <button class="qty-preset" data-qty="10">10</button>
        </div>
      `;
      // Local click handler for quantity presets
      inputsContainer.querySelectorAll('.qty-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = document.getElementById('trade-qty');
          if (input) input.value = btn.dataset.qty;
        });
      });
    }
  }

  _handleTrade(action, strike) {
    const qtyInput = document.getElementById('trade-qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    let type, isLong, isStock = false;
    switch (action) {
      case 'buy_call':  type = 'call'; isLong = true; break;
      case 'sell_call': type = 'call'; isLong = false; break;
      case 'buy_put':   type = 'put'; isLong = true; break;
      case 'sell_put':  type = 'put'; isLong = false; break;
      case 'buy_stock': type = null; isLong = true; isStock = true; break;
      case 'sell_stock': type = null; isLong = false; isStock = true; break;
      default: return;
    }

    if (this.onTrade) {
      this.onTrade({ type, isLong, strike, quantity, isStock });
    }
  }

  _handleClose(positionId) {
    if (this.onClosePosition) this.onClosePosition(positionId);
  }

  _updateStats(portfolio, market) {
    const pnlEl = document.getElementById('stat-pnl');
    if (!pnlEl) return;

    const getPrice = (pos) => {
      if (pos.isStock) return market.getCurrentPrice();
      return market.getOptionPrice(pos.optionType, pos.strike).mid;
    };

    const totalPnl = portfolio.getTotalPnL(getPrice);
    pnlEl.textContent = (totalPnl >= 0 ? '+' : '') + '$' + totalPnl.toFixed(2);
    pnlEl.className = 'stat-value ' + (totalPnl >= 0 ? 'text-green' : 'text-red');
  }

  // ─── Result Modal ───

  showResult(result, level, pnl, onNext, onRetry, onBack, extra) {
    const isWin = result === 'won';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const suggestion = (!isWin && extra && extra.suggestion) ? `<div class="loss-suggestion">${extra.suggestion}</div>` : '';
    overlay.innerHTML = `
      <div class="modal">
        <h2 style="color: ${isWin ? 'var(--accent-green)' : 'var(--accent-red)'};">
          ${isWin ? '通关成功!' : '时间到!'}
        </h2>
        ${isWin ? `<div class="reward">$${pnl.toFixed(2)}</div>` : ''}
        <p>
          ${isWin
            ? `恭喜！你成功完成了"${level.title}"。最终盈利 $${pnl.toFixed(2)}。`
            : `你未能达成目标。最终盈亏 $${pnl.toFixed(2)}。目标：${level.winText}。`}
        </p>
        ${suggestion}
        ${isWin
          ? `<button style="background: var(--accent-green); border-color: var(--accent-green); color: #fff; margin-right: 8px;" id="btn-next">下一关</button>`
          : `<button style="background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; margin-right: 8px;" id="btn-retry">重试</button>`}
        <button id="btn-back" style="background: transparent;">返回列表</button>
      </div>`;
    document.body.appendChild(overlay);

    const closeOverlay = () => overlay.remove();
    document.getElementById(isWin ? 'btn-next' : 'btn-retry').addEventListener('click', () => {
      closeOverlay();
      if (isWin) onNext();
      else onRetry();
    });
    document.getElementById('btn-back').addEventListener('click', () => {
      closeOverlay();
      if (onBack) onBack();
    });
    this._activeModal = overlay;
  }

  closeActiveModal() {
    if (this._activeModal) {
      this._activeModal.remove();
      this._activeModal = null;
    }
  }

  // ─── Toast (stackable) ───

  showToast(message, type = 'info', durationMs) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    const ttl = durationMs || (type === 'error' ? 5000 : 2800);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, ttl);
  }

  handleReset() {
    if (confirm('确定要重置所有游戏进度吗？此操作不可撤销。')) {
      if (this.onResetGame) this.onResetGame();
    }
  }
}
