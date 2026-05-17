# 期权交易教程游戏

一个纯前端期权交易教程游戏，通过模拟交易从零学习期权知识。从 Call/Put 基础概念到蝶式价差、跨式策略等高级组合，在操作中掌握期权交易。

## 快速开始

直接在浏览器中打开 `index.html`，或使用任意 HTTP 服务器：

```bash
python3 -m http.server 8080
# 访问 http://localhost:8080
```

无需安装依赖，无需构建工具。

## 游戏关卡

| 关卡 | 主题 | 学习内容 |
|------|------|----------|
| 1 | Call 基础 | 看涨期权概念、盈亏结构、杠杆效应 |
| 2 | Put 基础 | 看跌期权概念、做空机制、风险管理 |
| 3 | 定价因素 | 标的价格、行权价、时间衰减、波动率的影响 |
| 4 | Covered Call | 持股+卖出Call，收入策略，权利金收益 |
| 5 | Protective Put | 持股+买入Put，保险策略，下行保护 |
| 6 | Bull Call Spread | 牛市看涨价差，控制成本与风险 |
| 7 | Bear Put Spread | 熊市看跌价差，温和看跌策略 |
| 8 | Straddle | 跨式策略，赌波动不赌方向 |
| 9 | Butterfly Spread | 蝶式价差，低成本精准策略 |
| 10 | 自由交易 | 综合运用所有策略，挑战最大盈利 |

## 核心功能

- **Black-Scholes 定价引擎** — 实时计算期权理论价格和 Greeks 值
- **市场模拟器** — 基于几何布朗运动生成随机价格路径
- **仪表盘界面** — 期权链报价表 + Canvas 价格走势图 + 持仓面板
- **知识讲解常驻** — 教程内容始终显示在屏幕中央，无需弹窗遮挡
- **进度保存** — localStorage 自动保存通关进度

## 技术栈

- 纯 HTML + CSS + Vanilla JavaScript
- Canvas API 绘制价格图表
- Black-Scholes 期权定价模型

## 项目结构

```
├── index.html          # 主入口
├── css/
│   ├── main.css        # 全局样式
│   ├── dashboard.css   # 仪表盘布局
│   └── components.css  # 组件样式
└── js/
    ├── app.js          # 应用入口
    ├── engine.js       # Black-Scholes 期权定价引擎
    ├── market.js       # 市场模拟器
    ├── portfolio.js    # 持仓管理
    ├── game.js         # 游戏状态管理
    ├── chart.js        # Canvas 图表
    ├── levels.js       # 关卡定义
    └── ui.js           # UI 渲染
```

## 操作方式

1. 选择关卡进入
2. 阅读上方知识讲解
3. 点击"开始交易"
4. 在左侧期权链点击 **B**(买入) 或 **S**(卖出)
5. 点击"下一日"推进市场
6. 达到盈利目标即可通关
