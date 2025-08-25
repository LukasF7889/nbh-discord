import Mission from "../../models/mission.js";

class MissionRepository {
  async findById(id) {
    return await Mission.findById(id);
  }
}

export default new MissionRepository();
