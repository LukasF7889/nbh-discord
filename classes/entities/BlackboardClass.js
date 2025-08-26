class BlackboardClass {
  constructor(currentMissions, lastUpdated, key) {
    this.currentMissions = currentMissions;
    this.lastUpdated = lastUpdated;
    this.key = key;
  }

  needsUpdate() {
    if (!this.lastUpdated) return true;
    const refreshTime = 5 * 60 * 1000; //5 Minutes
    const needsUpdate =
      Date.now() - new Date(this.lastUpdated).getTime() > refreshTime;
    return needsUpdate;
  }

  updateMissions(newMissions) {
    this.currentMissions = newMissions;
    this.lastUpdated = new Date();
  }
}

export default BlackboardClass;
