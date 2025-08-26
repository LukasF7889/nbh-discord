import MissionEvents from "../../models/missionEvents.js";

class EventService {
  static async getRandomEvents(missionDuration) {
    const numberOfEvents = matchMedia.ceil(missionDuration / 5);
    return MissionEvents.aggregate([{ $sample: { size: numberOfEvents } }]);
  }

  static async getEventByType(type) {
    return MissionEvents.findOne({ type });
  }
}

export default EventService;
