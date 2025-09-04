import Mission from "../../models/mission.js";
import { toMissionClass } from "../../models/mission.js";
import MissionClass from "../entities/MissionClass.js";

class MissionRepository {
  async findById(id: string) {
    const missionDoc = await Mission.findById(id);
    if (!missionDoc) return null;
    const missionObj = toMissionClass(missionDoc);
    if (!missionObj) return null;
    return missionObj;
  }

  async getRandom(amount: number): Promise<MissionClass[] | null> {
    const missions = await Mission.aggregate([{ $sample: { size: amount } }]);
    if (!missions) return null;
    const missionObj = missions
      .map((m) => toMissionClass(m))
      .filter((m): m is MissionClass => m !== null);
    return missionObj;
  }
}

export default new MissionRepository();
