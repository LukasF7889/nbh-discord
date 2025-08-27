import { toMissionClass } from "../../models/mission.js";
import MissionRepository from "../repositories/MissionRepository.js";
import PlayerRepository from "../repositories/PlayerRepository.js";

class MissionService {
  static async loadMission(missionId) {
    const missionDoc = await MissionRepository.findById(missionId);
    if (!missionDoc) return null;
    const mission = toMissionClass(missionDoc);
    return mission;
  }

  static async startMission(player, mission, events, getItemFn) {
    if (mission.cost > player.energy.current) {
      return {
        success: false,
        message: "Nicht genug Energie, um die Mission zu starten",
        player,
      };
    }

    player.substractEnergy(mission.cost);

    const missionFeedback = mission.checkSuccess(player);

    if (missionFeedback.success) {
      player.addXP(mission.xp);
    }

    const eventFeedback = await mission.callEvents(player, events, getItemFn);

    for (const e of eventFeedback) {
      if (e.item?.quantity) await player.addItemToInventory(e.item);
    }

    await PlayerRepository.save(player);

    return {
      success: missionFeedback.success,
      missionFeedback,
      eventFeedback,
      player,
    };
  }
}

export default MissionService;
