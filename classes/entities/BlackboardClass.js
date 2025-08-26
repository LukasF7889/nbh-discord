class Blackboard {
  constructor(currentMissions, lastUpdated) {
    this.currentMissions = currentMissions;
    this.lastUpdated = lastUpdated;
  }

  needsUpdate() {
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

export default Blackboard;
