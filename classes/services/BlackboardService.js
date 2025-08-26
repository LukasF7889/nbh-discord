import BlackboardRepository from "../repositories/BlackboardRepository.js";
import MissionRepository from "../repositories/MissionRepository.js";
import { toBlackboardClass } from "../../models/blackboard.js";

class BlackboardService {
  static async getMissions() {
    const blackboardDoc = await BlackboardRepository.get();
    const blackboard = toBlackboardClass(blackboardDoc);

    if (blackboard.needsUpdate()) {
      const newMissions = await MissionRepository.getRandom(2);
      blackboard.updateMissions(newMissions);
      await BlackboardRepository.save(blackboard);
    }

    return blackboard.currentMissions;
  }
}

export default BlackboardService;
