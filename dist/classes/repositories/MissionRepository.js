import Mission from "../../models/mission.js";
import { toMissionClass } from "../../models/mission.js";
class MissionRepository {
    async findById(id) {
        const missionDoc = await Mission.findById(id);
        if (!missionDoc)
            return null;
        const missionObj = toMissionClass(missionDoc);
        if (!missionObj)
            return null;
        return missionObj;
    }
    async getRandom(amount) {
        const missions = await Mission.aggregate([{ $sample: { size: amount } }]);
        if (!missions)
            return null;
        const missionObj = missions
            .map((m) => toMissionClass(m))
            .filter((m) => m !== null);
        return missionObj;
    }
}
export default new MissionRepository();
//# sourceMappingURL=MissionRepository.js.map