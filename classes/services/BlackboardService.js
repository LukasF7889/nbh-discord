import BlackboardRepository from "../repositories/BlackboardRepository.js";
import MissionRepository from "../repositories/MissionRepository.js";
import { toBlackboardClass } from "../../models/blackboard.js";

class BlackboardService {
  static async getBlackboard() {
    const blackboardDoc = await BlackboardRepository.get();
    const blackboard = toBlackboardClass(blackboardDoc);

    if (blackboard.needsUpdate()) {
      const newMissions = await MissionRepository.getRandom(3);
      blackboard.updateMissions(newMissions);
      await BlackboardRepository.save(blackboard);
      console.log("Got new missions");
    }

    return blackboard;
  }
}

export default BlackboardService;
