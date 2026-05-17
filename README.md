# 期权交易教程游戏

一个面向**完全新手**的纯前端期权交易教程游戏。从"什么是期权"的概念开始，通过 4 页互动序章 + 16 个渐进式关卡，让小白也能在操作中掌握 Call/Put、Greeks、价差、波动率策略和 Iron Condor 等核心知识。

## 快速开始

```bash
python3 -m http.server 8080
# 访问 http://localhost:8080
```

无需安装依赖，无需构建工具。

## 课程结构

### 📚 新手序章（4 页）

首次打开自动进入，4 页互动导引：

| # | 内容 |
|---|---|
| 1 | 什么是期权？（机票退改险 / 买房定金类比） |
| 2 | 4 个核心要素（标的 / 行权价 / 到期日 / 权利金） |
| 3 | Call vs Put 直觉对比（涨用 Call / 跌用 Put） |
| 4 | 仪表盘界面导览（期权链、Payoff 图、Net Greeks） |

### 🎯 16 个关卡（8 个 Phase）

| Phase | 关卡 | 主题 |
|---|---|---|
| **1 · 入门** | 1 | 我的第一笔 Call（友好市场，超长窗口） |
| | 2 | 我的第一笔 Put |
| | 3 | **Theta 实验** — 观察时间衰减（不要求盈利） |
| | 4 | **波动率实验** — 体验高波动如何抬高期权价 |
| **2 · 定价综合** | 5 | Greeks 综合（Delta/Gamma/Theta/Vega） |
| **3 · 卖方视角** | 6 | **卖出 Call** — 体验 Theta 收益与上行风险 |
| | 7 | **卖出 Put** — "愿意低价接货"的逻辑 |
| **4 · 持仓+期权** | 8 | Covered Call |
| | 9 | Protective Put |
| **5 · 垂直价差** | 10 | Bull Call Spread |
| | 11 | Bear Put Spread |
| **6 · 波动率策略** | 12 | Long Straddle |
| | 13 | **Long Strangle** — Straddle 的便宜版 |
| **7 · 高级组合** | 14 | Butterfly Spread |
| | 15 | **Iron Condor** — 区间收 Theta 王者 |
| **8 · 终极挑战** | 16 | 自由交易（综合运用） |

加粗的是本次新增/重做的关卡。整体斜率比之前 10 关版本平缓很多 — 单腿基础 4 关、卖方有专门 Phase、波动率策略也有渐进。

## 核心功能

- **Black-Scholes 定价引擎** — 实时计算期权理论价格和 Greeks 值
- **市场模拟器** — 基于几何布朗运动生成随机价格路径，行权价步长自适应
- **到期盈亏图（Payoff Diagram）** — 实时 SVG 绘制组合盈亏曲线，标注盈亏平衡点
- **持仓 Net Greeks** — 组合的 Δ/Γ/Θ/ν 实时聚合显示
- **裸卖保证金检查** — 简化 CBOE 规则估算
- **策略路径清单** — 每关显示完整策略的步骤进度
- **失败建议** — 通关失败时基于持仓与市场走势给出针对性建议
- **快捷键** — 空格=下一日 / Esc=关弹窗 / 数字键=数量
- **多日推进** — 一键快进 5 天或跳到到期
- **进度保存** — localStorage 自动保存关卡和序章状态

## 技术栈

纯 HTML + CSS + Vanilla JavaScript。无构建工具。

## 项目结构

```
├── index.html
├── css/
│   ├── main.css        # 全局样式
│   ├── dashboard.css   # 仪表盘布局
│   └── components.css  # 组件 / Onboarding / Phase 分组
└── js/
    ├── app.js          # 应用入口 + 键盘快捷键
    ├── engine.js       # Black-Scholes 期权定价
    ├── market.js       # 市场模拟器
    ├── portfolio.js    # 持仓管理 + 保证金
    ├── game.js         # 游戏状态 + 关卡解锁
    ├── chart.js        # Canvas 价格图表
    ├── payoff.js       # SVG 到期盈亏图
    ├── onboarding.js   # 序章 4 页 + localStorage 状态
    └── levels/
        ├── _registry.js                  # LEVEL_DEFINITIONS 数组 + PHASES 分组
        ├── level01_call_basics.js
        ├── level02_put_basics.js
        ├── level03_theta_experiment.js
        ├── level04_vega_experiment.js
        ├── level05_greeks_combined.js
        ├── level06_short_call.js
        ├── level07_short_put.js
        ├── level08_covered_call.js
        ├── level09_protective_put.js
        ├── level10_bull_call_spread.js
        ├── level11_bear_put_spread.js
        ├── level12_straddle.js
        ├── level13_strangle.js
        ├── level14_butterfly.js
        ├── level15_iron_condor.js
        └── level16_free_trading.js
```

## 操作方式

1. 首次进入 → 自动开始序章（4 页阅读完毕后解锁第 1 关）
2. 选择关卡进入 → 阅读知识讲解
3. 点击"开始交易"
4. 在期权链点击 **B**(买入) / **S**(卖出)，按 **空格** 推进时间
5. 观察持仓面板的 **Net Greeks** 和知识面板的 **Payoff 图**
6. 达到通关条件即可解锁下一关
