import Blackboard, { toBlackboardClass } from "../../models/blackboard.js";
import MissionRepository from "./MissionRepository.js";

class BlackboardRepository {
  async save(blackboard) {
    const bb = await Blackboard.findOneAndUpdate(
      { key: "main" },
      blackboard.toObject(),
      {
        new: true,
        upsert: true,
      }
    );
    return bb;
  }

  async create(refreshTimeMinutes = 300000) {
    const newBB = await Blackboard.create({
      key: "main",
      currentMissions: await MissionRepository.getRandom(2),
      lastUpdated: new Date(),
      refreshTime: refreshTimeMinutes,
    });
    return newBB;
  }

  async get() {
    const bbDoc = await Blackboard.findOne({ key: "main" });
    const bb = toBlackboardClass(bbDoc);
    if (!bb) {
      return await this.create();
    }
    return bb;
  }
}

export default new BlackboardRepository();
