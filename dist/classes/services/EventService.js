import { MissionEventModel, } from "../entities/MissionEventClass.js";
class EventService {
    static async getRandomEvents(missionDuration) {
        const numberOfEvents = Math.ceil(missionDuration / 5);
        return MissionEventModel.aggregate([{ $sample: { size: numberOfEvents } }]);
    }
    static async getEventByType(type) {
        return MissionEventModel.findOne({ type });
    }
}
export default EventService;
//# sourceMappingURL=EventService.js.map