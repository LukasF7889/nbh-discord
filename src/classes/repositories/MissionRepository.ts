import MissionClass, { MissionModel } from "../entities/MissionClass.js";

class MissionRepository {
  async findById(id: string) {
    const missionDoc = await MissionModel.findById(id);
    if (!missionDoc) return null;
    const missionObj = MissionClass.fromDoc(missionDoc);
    if (!missionObj) return null;
    return missionObj;
  }

  async getRandom(amount: number): Promise<MissionClass[] | null> {
    const missions = await MissionModel.aggregate([
      { $sample: { size: amount } },
    ]);
    if (!missions) return null;

    const missionObj = missions
      .map((m) => MissionClass.fromObj(m))
      .filter((m): m is MissionClass => m !== null);
    return missionObj;
  }
}

export default new MissionRepository();
