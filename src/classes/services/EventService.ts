import MissionEvents from "../../models/missionEvents.js";

class EventService {
  static async getRandomEvents(missionDuration: number) {
    const numberOfEvents = Math.ceil(missionDuration / 5);
    return MissionEvents.aggregate([{ $sample: { size: numberOfEvents } }]);
  }

  static async getEventByType(type: string) {
    return MissionEvents.findOne({ type });
  }
}

export default EventService;
