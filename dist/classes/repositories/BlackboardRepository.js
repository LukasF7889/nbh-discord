import MissionRepository from "./MissionRepository.js";
import BlackboardClass, { BlackboardModel, } from "../entities/BlackboardClass.js";
class BlackboardRepository {
    async save(blackboard) {
        const bbDoc = await BlackboardModel.findOneAndUpdate({ key: "main" }, blackboard.toObject(), {
            new: true,
            upsert: true,
        });
        return BlackboardClass.fromDoc(bbDoc);
    }
    async create(refreshTime = 300000) {
        const missions = await MissionRepository.getRandom(3);
        if (!missions || missions.length === 0)
            throw new Error("Error getting missions");
        const newBBInstance = new BlackboardClass({
            key: "main",
            currentMissions: missions,
            lastUpdated: new Date(),
            refreshTime,
        });
        const bbDoc = await BlackboardModel.create(newBBInstance.toObject());
        return BlackboardClass.fromDoc(bbDoc);
    }
    async get() {
        const bbDoc = await BlackboardModel.findOne({ key: "main" });
        if (!bbDoc) {
            return await this.create();
        }
        return BlackboardClass.fromDoc(bbDoc);
    }
}
export default new BlackboardRepository();
//# sourceMappingURL=BlackboardRepository.js.map