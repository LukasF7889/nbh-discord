import Mission from "../../models/mission.js";
import { toMissionClass } from "../../models/mission.js";
class MissionRepository {
    async findById(id) {
        const missionDoc = await Mission.findById(id);
        const missionObj = toMissionClass(missionDoc);
        return missionObj;
    }
    async getRandom(amount) {
        const missions = await Mission.aggregate([
            { $sample: { size: amount } },
        ]);
        const missionObj = missions.map((m) => toMissionClass(m));
        return missionObj;
    }
}
export default new MissionRepository();
//# sourceMappingURL=MissionRepository.js.map