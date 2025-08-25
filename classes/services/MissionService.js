import { toMissionClass } from "../../models/mission";
import MissionRepository from "../repositories/MissionRepository";
import PlayerRepository from "../PlayerRepository";

class MissionService {
  static async loadMission(missionId) {
    const missionDoc = await MissionRepository.findById(missionId);
    if (!missionDoc) return null;
    const mission = toMissionClass(missionDoc);
    return mission;
  }

  static async startMission(player, mission, events, getItemFn) {
    if (mission.cost > player.energy) {
      return { error: "Nicht genug Energie, um diese Mission zu starten" };
    }

    player.energy -= mission.cost;

    const missionFeedback = mission.checkSuccess(player);

    if (missionFeedback.success) {
      player.xp += mission.xp;
    }

    const eventFeedback = await mission.callEvents(player, events, getItemFn);

    for (const e of eventFeedback) {
      if (e.item && e.item.quantity) await player.addItemToInventory(e.item);
    }

    await PlayerRepository.save(player);

    return { missionFeedback, eventFeedback, player };
  }
}

export default MissionService;
