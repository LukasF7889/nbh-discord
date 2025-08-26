import Mission from "../../models/mission.js";

class MissionRepository {
  async findById(id) {
    return await Mission.findById(id);
  }

  async getRandom(amount) {
    return await Mission.aggregate([{ sample: { size: amount } }]);
  }
}

export default new MissionRepository();
