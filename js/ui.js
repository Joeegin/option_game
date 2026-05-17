/**
 * UI Manager
 * Handles all DOM rendering and user interaction.
 */
class UI {
  constructor() {
    this.app = document.getElementById('app');
    this.onTrade = null; // callback(tradeConfig)
    this.onAdvanceDay = null;
    this.onStartLevel = null;
    this.onSelectLevel = null;
    this.onClosePosition = null;
    this.onResetGame = null;
  }

  // ─── Level Select Screen ───

  renderLevelSelect(levels, game) {
    const progress = game.getProgress();
    let cards = '';
    levels.forEach(level => {
      const unlocked = game.isUnlocked(level.id);
      const completed = game.isCompleted(level.id);
      let cls = '';
      if (completed) cls = 'completed';
      else if (!unlocked) cls = 'locked';

      cards += `
        <div class="level-card ${cls}" data-level="${level.id}" ${!unlocked ? '' : ''}>
          <div class="card-level">${unlocked ? level.id : '🔒'}</div>
          <div class="card-title">${level.shortTitle}</div>
        </div>`;
    });

    this.app.innerHTML = `
      <div class="level-select">
        <h1>期权交易教程</h1>
        <p class="subtitle">
          从零开始学习期权交易 · ${progress.completed}/${progress.total} 关已完成
        </p>
        <div class="level-grid">${cards}</div>
        <div style="margin-top: 24px;">
          <button onclick="ui.handleReset()" style="color: var(--text-muted); font-size: 12px; background: transparent; border-color: transparent;">
            重置进度
          </button>
        </div>
      </div>`;

    // Bind click events
    this.app.querySelectorAll('.level-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const levelId = parseInt(card.dataset.level);
        if (this.onSelectLevel) this.onSelectLevel(levelId);
      });
    });
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
            <div class="stat-value">$${portfolio.getCash().toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
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
        <!-- Options Chain -->
        <div class="panel" id="panel-chain">
          <div class="panel-header">期权链</div>
          <div class="panel-content" id="chain-content"></div>
        </div>
        <!-- Middle: Knowledge Panel (top) + Chart (bottom) — both always visible -->
        <div class="middle-area">
          <div class="knowledge-panel" id="knowledge-panel">
            <div class="kp-header">
              <span>知识讲解</span>
              <span style="font-size: 11px; color: var(--text-muted);" id="kp-level-label"></span>
            </div>
            <div class="kp-content" id="kp-content"></div>
            <div class="kp-footer" id="kp-footer" style="display: none;"></div>
          </div>
          <div class="chart-container" id="chart-container">
            <canvas id="price-chart"></canvas>
          </div>
        </div>
        <!-- Positions -->
        <div class="panel" id="panel-positions">
          <div class="panel-header">持仓</div>
          <div class="panel-content" id="positions-content"></div>
        </div>
      </div>
      <div class="trade-panel" id="trade-panel">
        <div class="trade-buttons" id="trade-buttons"></div>
        <div class="trade-inputs" id="trade-inputs"></div>
        <button id="btn-advance" style="margin-left: 12px; padding: 8px 20px; background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; font-weight: bold;">
          下一日 ▶
        </button>
      </div>`;

    // Set up advance day button
    document.getElementById('btn-advance').addEventListener('click', () => {
      if (this.onAdvanceDay) this.onAdvanceDay();
    });

    // Initial render of panels
    this._renderOptionsChain(market, level);
    this._renderPositions(portfolio, market);
    this._renderKnowledgePanel(level, market, game);
    this._renderTradeButtons(level);
    this._updateStats(portfolio, market);
  }

  // ─── Update existing dashboard ───

  updateDashboard(level, market, portfolio, game) {
    this._renderOptionsChain(market, level);
    this._renderPositions(portfolio, market);
    this._renderKnowledgePanel(level, market, game);
    this._renderTradeButtons(level);
    this._updateStats(portfolio, market);

    // Update days
    const daysEl = document.getElementById('stat-days');
    if (daysEl) {
      daysEl.textContent = `${market.getDaysRemaining()} / ${market.getTotalDays()}`;
    }
  }

  _renderOptionsChain(market, level) {
    const container = document.getElementById('chain-content');
    if (!container) return;

    const chain = market.getOptionsChain();
    const currentPrice = market.getCurrentPrice();
    const daysLeft = market.getDaysRemaining();

    let html = `
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; padding: 0 8px;">
        <span>标的价格: <strong style="color: var(--text-primary);">$${currentPrice.toFixed(2)}</strong></span>
        <span style="margin-left: 12px;">剩余: <strong>${daysLeft}</strong> 天</span>
      </div>
      <table class="options-chain">
        <thead>
          <tr>
            <th colspan="3" style="text-align: center; color: var(--accent-green);">CALL</th>
            <th>行权价</th>
            <th colspan="3" style="text-align: center; color: var(--accent-red);">PUT</th>
          </tr>
          <tr>
            <th>Bid</th><th>Ask</th><th></th>
            <th></th>
            <th></th><th>Bid</th><th>Ask</th>
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
          html += `<button class="buy" onclick="event.stopPropagation(); ui._handleTrade('buy_call', ${opt.strike})">B</button>`;
        }
        if (level.allowedActions.includes('sell_call')) {
          html += `<button class="sell" onclick="event.stopPropagation(); ui._handleTrade('sell_call', ${opt.strike})">S</button>`;
        }
        html += `</div>`;
      }

      html += `</td>
        <td style="font-weight: bold; ${isATM ? 'color: var(--accent-blue);' : ''}">$${opt.strike}</td>
        <td>`;

      if (level.allowedActions.includes('buy_put') || level.allowedActions.includes('sell_put')) {
        html += `<div class="action-btns">`;
        if (level.allowedActions.includes('buy_put')) {
          html += `<button class="buy" onclick="event.stopPropagation(); ui._handleTrade('buy_put', ${opt.strike})">B</button>`;
        }
        if (level.allowedActions.includes('sell_put')) {
          html += `<button class="sell" onclick="event.stopPropagation(); ui._handleTrade('sell_put', ${opt.strike})">S</button>`;
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
    if (!container) return;

    const positions = portfolio.getPositions();
    const price = market.getCurrentPrice();

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
          <button class="close-btn" onclick="ui._handleClose(${pos.id})">平仓</button>
        </div>`;
    }

    container.innerHTML = html;
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
      // Before starting: show tutorial in scrollable area, start button in footer
      content.innerHTML = `<div class="tutorial-full">${level.tutorial}</div>`;
      footer.style.display = '';
      footer.innerHTML = `
        <div class="kp-start-area">
          <div class="objective-badge">目标：${level.winText}</div>
          <button class="btn-start-trading" id="btn-start-trading">开始交易</button>
        </div>`;
      const btn = document.getElementById('btn-start-trading');
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.onStartLevel) this.onStartLevel();
        });
      }
    } else {
      // During trading: strategy guide + collapsible tutorial
      const info = level.knowledgePanel || '';
      const guide = info
        .replace(/\{S\}/g, '$' + S.toFixed(2))
        .replace(/\{T\}/g, daysLeft.toString())
        .replace(/\{ATM_CALL\}/g, '$' + atmCall.toFixed(2))
        .replace(/\{ATM_PUT\}/g, '$' + atmPut.toFixed(2))
        .replace(/\{SIGMA\}/g, (sigma * 100).toFixed(0) + '%');

      content.innerHTML = `
        <div class="kp-guide-box">${guide}</div>
        <details class="kp-tutorial-details">
          <summary>完整教程</summary>
          <div class="tutorial-full">${level.tutorial}</div>
        </details>`;
      footer.style.display = 'none';
    }
  }

  _renderTradeButtons(level) {
    const container = document.getElementById('trade-buttons');
    if (!container) return;

    const allowed = level.allowedActions;
    let html = '';

    if (allowed.includes('buy_stock')) {
      html += `<button class="buy" id="btn-buy-stock">买入股票</button>`;
    }
    if (allowed.includes('sell_stock')) {
      html += `<button class="sell" id="btn-sell-stock">卖出股票</button>`;
    }

    container.innerHTML = html;

    // Stock trade handlers
    const btnBuyStock = document.getElementById('btn-buy-stock');
    if (btnBuyStock) {
      btnBuyStock.addEventListener('click', () => this._handleTrade('buy_stock', 0));
    }
    const btnSellStock = document.getElementById('btn-sell-stock');
    if (btnSellStock) {
      btnSellStock.addEventListener('click', () => this._handleTrade('sell_stock', 0));
    }

    // Trade inputs
    const inputsContainer = document.getElementById('trade-inputs');
    if (inputsContainer) {
      inputsContainer.innerHTML = `
        <label>数量</label>
        <input type="number" id="trade-qty" value="1" min="1" max="100" style="width: 60px;">
      `;
    }
  }

  _handleTrade(action, strike) {
    const qtyInput = document.getElementById('trade-qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    let type, isLong;
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
      this.onTrade({ type, isLong, strike, quantity, isStock: action === 'buy_stock' || action === 'sell_stock' });
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

  // ─── View Switching (no longer needed — knowledge panel is always visible) ───

  // ─── Result Modal ───

  showResult(result, level, pnl, onNext, onRetry, onBack) {
    const isWin = result === 'won';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h2 style="color: ${isWin ? 'var(--accent-green)' : 'var(--accent-red)'};">
          ${isWin ? '通关成功!' : '时间到!'}
        </h2>
        ${isWin ? `<div class="reward">$${pnl.toFixed(2)}</div>` : ''}
        <p>
          ${isWin
            ? `恭喜！你成功完成了"${level.title}"。最终盈利 $${pnl.toFixed(2)}。`
            : `你未能达成目标。最终盈亏 $${pnl.toFixed(2)}。目标：${level.winText}。再试一次吧！`}
        </p>
        ${isWin
          ? `<button style="background: var(--accent-green); border-color: var(--accent-green); color: #fff; margin-right: 8px;" id="btn-next">下一关</button>`
          : `<button style="background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; margin-right: 8px;" id="btn-retry">重试</button>`}
        <button id="btn-back" style="background: transparent;">返回列表</button>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById(isWin ? 'btn-next' : 'btn-retry').addEventListener('click', () => {
      overlay.remove();
      if (isWin) onNext();
      else onRetry();
    });
    document.getElementById('btn-back').addEventListener('click', () => {
      overlay.remove();
      if (onBack) onBack();
    });
  }

  // ─── Toast ───

  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
  }

  // ─── Reset handler ───

  handleReset() {
    if (confirm('确定要重置所有游戏进度吗？此操作不可撤销。')) {
      if (this.onResetGame) this.onResetGame();
    }
  }
}
