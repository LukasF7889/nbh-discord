import Blackboard from "../../models/blackboard.js";
import MissionRepository from "./MissionRepository.js";

class BlackboardRepository {
  async save(data) {
    const bb = await Blackboard.findOneAndUpdate({ key: "main" }, data, {
      new: true,
      upsert: true,
    });
    return bb;
  }

  async create() {
    Blackboard.create({
      key: "main",
      currentMissions: await MissionRepository.getRandom(2),
      lastUpdated: new Date(),
    });
  }

  async get() {
    const bb = await Blackboard.findOne({ key: "main" });
    if (!bb) {
      return await this.create();
    }
    return bb;
  }
}

export default new BlackboardRepository();
