import MissionEventClass, {
  MissionEventModel,
} from "../entities/MissionEventClass.js";

class EventService {
  static async getRandomEvents(missionDuration: number) {
    const numberOfEvents = Math.ceil(missionDuration / 5);
    return MissionEventModel.aggregate([{ $sample: { size: numberOfEvents } }]);
  }

  static async getEventByType(type: string) {
    return MissionEventModel.findOne({ type });
  }
}

export default EventService;
