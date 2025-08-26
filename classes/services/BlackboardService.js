import BlackboardRepository from "../repositories/BlackboardRepository";
import Blackboard from "../entities/BlackBoardClass";
import MissionRepository from "../repositories/MissionRepository";

class BlackboardService {
  static async getMissions() {
    const blackboard = await BlackboardRepository.get();

    if (blackboard.needsUpdate()) {
      const newMissions = await MissionRepository.getRandom(2);
      await blackboard.updateMissions(newMissions);
      await BlackboardRepository.save(blackboard);
    }

    return blackboard.currentMissions;
  }
}

export default BlackboardService;
