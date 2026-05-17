/**
 * Level Registry
 * Each level file pushes its definition into LEVEL_DEFINITIONS in order.
 *
 * Phase grouping (used by the level-select screen):
 *   1 入门: Level 1-4   (单腿做多 + Theta/Vega 观察)
 *   2 进阶: Level 5     (Greeks 综合)
 *   3 卖方: Level 6-7   (卖出 Call / Put)
 *   4 持仓增强: Level 8-9   (Covered Call / Protective Put)
 *   5 价差: Level 10-11 (Bull/Bear Spread)
 *   6 波动率: Level 12-13 (Straddle / Strangle)
 *   7 高级: Level 14-15 (Butterfly / Iron Condor)
 *   8 自由: Level 16
 *
 * Placeholders (replaced at runtime):
 *   {S} = current stock price
 *   {T} = days remaining
 *   {ATM_CALL} = ATM call price
 *   {ATM_PUT} = ATM put price
 *   {SIGMA} = volatility
 */
const LEVEL_DEFINITIONS = [];

const PHASES = [
  { id: 1, title: 'Phase 1 · 入门', desc: '认识 Call / Put，体验时间衰减与波动率', levels: [1, 2, 3, 4] },
  { id: 2, title: 'Phase 2 · 定价综合', desc: '把 Greeks 串起来', levels: [5] },
  { id: 3, title: 'Phase 3 · 卖方视角', desc: '当卖方是什么感觉', levels: [6, 7] },
  { id: 4, title: 'Phase 4 · 持仓+期权', desc: '为持股增收 / 上保险', levels: [8, 9] },
  { id: 5, title: 'Phase 5 · 垂直价差', desc: '控制成本与风险的组合', levels: [10, 11] },
  { id: 6, title: 'Phase 6 · 波动率策略', desc: '赌波动不赌方向', levels: [12, 13] },
  { id: 7, title: 'Phase 7 · 高级组合', desc: '精准押注 + 区间盈利', levels: [14, 15] },
  { id: 8, title: 'Phase 8 · 终极挑战', desc: '综合运用全部武器', levels: [16] },
];
