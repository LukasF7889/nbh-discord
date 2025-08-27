class BlackboardClass {
  constructor({ currentMissions, lastUpdated, key, refreshTime = 300000 }) {
    this.currentMissions = currentMissions;
    this.lastUpdated = lastUpdated ? new Date(lastUpdated) : null;
    this.key = key;
    this.refreshTime = refreshTime;
  }

  toObject() {
    return {
      ...this,
      currentMissions: this.currentMissions.map((m) => m.toObject()), // zurück in plain objects
    };
  }

  needsUpdate() {
    if (!this.lastUpdated) return true;
    const needsUpdate =
      Date.now() - new Date(this.lastUpdated).getTime() > this.refreshTime;
    return needsUpdate;
  }

  updateMissions(newMissions) {
    this.currentMissions = newMissions;
    this.lastUpdated = new Date();
  }

  getRefreshTime() {
    if (!this.lastUpdated) return this.refreshTime / 1000 / 60;
    const elapsed = Date.now() - new Date(this.lastUpdated).getTime();
    const remaining = this.refreshTime - elapsed;
    return Math.max(0, remaining / 1000 / 60);
  }
}

export default BlackboardClass;
