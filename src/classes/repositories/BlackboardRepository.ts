import Blackboard, { toBlackboardClass } from "../../models/blackboard.js";
import MissionRepository from "./MissionRepository.js";
import BlackboardClass from "../entities/BlackboardClass.js";

class BlackboardRepository {
  async save(blackboard: BlackboardClass) {
    const bbDoc = await Blackboard.findOneAndUpdate(
      { key: "main" },
      blackboard.toObject(),
      {
        new: true,
        upsert: true,
      }
    );
    return toBlackboardClass(bbDoc);
  }

  async create(refreshTime = 300000) {
    const missions = await MissionRepository.getRandom(3);
    if (!missions) throw new Error("Error getting missions");
    const newBBInstance = new BlackboardClass({
      key: "main",
      currentMissions: missions,
      lastUpdated: new Date(),
      refreshTime,
    });

    const bbDoc = await Blackboard.create(newBBInstance.toObject());
    return toBlackboardClass(bbDoc);
  }

  async get() {
    const bbDoc = await Blackboard.findOne({ key: "main" });
    if (!bbDoc) {
      return await this.create();
    }

    return toBlackboardClass(bbDoc);
  }
}

export default new BlackboardRepository();
