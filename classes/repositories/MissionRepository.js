import Mission from "../../models/mission.js";
import { toMissionClass } from "../../models/mission.js";
import MissionClass from "../entities/MissionClass.js";

class MissionRepository {
  async findById(id) {
    const missionDoc = await Mission.findById(id);
    const missionObj = toMissionClass(missionDoc);
    return missionObj;
  }

  async getRandom(amount) {
    const missions = await Mission.aggregate([{ $sample: { size: amount } }]);
    console.log("MISSIONS ", missions);
    const missionObj = missions.map(
      (m) =>
        new MissionClass({
          _id: m._id,
          title: m.title,
          description: m.description,
          duration: m.duration,
          level: m.level,
          cost: m.cost,
          xp: m.xp,
          difficulty: m.difficulty,
          challenge: m.challenge,
          message: m.message,
        })
    );
    return missionObj;
  }
}

export default new MissionRepository();
