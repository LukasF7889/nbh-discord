import Mission from "../../models/mission.js";
import { objToMissionClass, docToMissionClass } from "../../models/mission.js";
class MissionRepository {
    async findById(id) {
        const missionDoc = await Mission.findById(id);
        if (!missionDoc)
            return null;
        const missionObj = docToMissionClass(missionDoc);
        if (!missionObj)
            return null;
        return missionObj;
    }
    async getRandom(amount) {
        const missions = await Mission.aggregate([{ $sample: { size: amount } }]);
        if (!missions)
            return null;
        const missionObj = missions
            .map((m) => objToMissionClass(m))
            .filter((m) => m !== null);
        console.log("FETCHED MISSIONS ", missionObj);
        return missionObj;
    }
}
export default new MissionRepository();
//# sourceMappingURL=MissionRepository.js.map