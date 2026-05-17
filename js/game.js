/**
 * Game State Manager
 * Controls level progression, win/loss conditions, and game flow.
 */
class Game {
  constructor() {
    this.state = 'idle'; // idle | tutorial | playing | won | lost
    this.currentLevelId = 0;
    this.currentLevel = null;
    this.completedLevels = new Set();
    this.unlockedLevel = 1; // Levels start at 1; level 1 always unlocked

    this._loadProgress();
  }

  _loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem('optionGameProgress'));
      if (saved) {
        this.completedLevels = new Set(saved.completedLevels || []);
        this.unlockedLevel = saved.unlockedLevel || 1;
      }
    } catch (e) {
      // ignore
    }
  }

  _saveProgress() {
    try {
      localStorage.setItem('optionGameProgress', JSON.stringify({
        completedLevels: [...this.completedLevels],
        unlockedLevel: this.unlockedLevel,
      }));
    } catch (e) {
      // ignore
    }
  }

  /** Get all level definitions */
  getAllLevels() {
    return LEVEL_DEFINITIONS;
  }

  /** Load a specific level */
  loadLevel(levelId) {
    const level = LEVEL_DEFINITIONS.find(l => l.id === levelId);
    if (!level) return false;
    if (levelId > this.unlockedLevel) return false;

    this.currentLevelId = levelId;
    this.currentLevel = level;
    this.state = 'tutorial';
    return true;
  }

  /** Start playing after tutorial */
  startPlaying() {
    this.state = 'playing';
  }

  /**
   * Check win/loss conditions
   * @param {number} pnl - Current total P&L
   * @param {number} portfolioValue - Total portfolio value
   * @param {number} day - Current day
   * @param {number} totalDays - Total days in level
   * @param {Portfolio} portfolio - Portfolio instance
   */
  checkConditions(pnl, portfolioValue, day, totalDays, portfolio) {
    if (this.state !== 'playing') return null;

    const level = this.currentLevel;
    if (!level) return null;

    // Check win
    if (level.winCondition(pnl, portfolioValue, day, portfolio)) {
      this.state = 'won';
      this.completedLevels.add(this.currentLevelId);
      if (this.currentLevelId + 1 <= LEVEL_DEFINITIONS.length) {
        this.unlockedLevel = Math.max(this.unlockedLevel, this.currentLevelId + 1);
      }
      this._saveProgress();
      return 'won';
    }

    // Check loss (out of time)
    if (day >= totalDays) {
      this.state = 'lost';
      return 'lost';
    }

    return null;
  }

  /** Reset level state */
  resetLevel() {
    this.state = 'playing';
  }

  /** Get current state */
  getState() {
    return this.state;
  }

  /** Is a level completed? */
  isCompleted(levelId) {
    return this.completedLevels.has(levelId);
  }

  /** Is a level unlocked? Level 1 requires onboarding completion. */
  isUnlocked(levelId) {
    if (levelId === 1 && typeof Onboarding !== 'undefined' && !Onboarding.isCompleted()) {
      return false;
    }
    return levelId <= this.unlockedLevel;
  }

  /** All levels grouped by phase, for the level-select screen. */
  getLevelsByPhase() {
    if (typeof PHASES === 'undefined') return [{ id: 0, title: '关卡', desc: '', levels: LEVEL_DEFINITIONS }];
    return PHASES.map(phase => ({
      ...phase,
      levels: LEVEL_DEFINITIONS.filter(l => phase.levels.includes(l.id)),
    }));
  }

  /** Get progress summary */
  getProgress() {
    return {
      completed: this.completedLevels.size,
      total: LEVEL_DEFINITIONS.length,
      unlockedLevel: this.unlockedLevel,
    };
  }

  /** Reset all progress */
  resetAll() {
    this.completedLevels.clear();
    this.unlockedLevel = 1;
    this._saveProgress();
  }
}
