import { toMissionClass } from "../../models/mission.js";
import MissionClass from "../entities/MissionClass.js";
import PlayerClass from "../entities/PlayerClass.js";
import MissionRepository from "../repositories/MissionRepository.js";
import PlayerRepository from "../repositories/PlayerRepository.js";
import type { MissionEventType } from "../../types/missionEventType.js";

class MissionService {
  static async loadMission(missionId: string) {
    const mission: MissionClass | null = await MissionRepository.findById(
      missionId
    );
    if (!mission) return null;
    return mission;
  }

  static async startMission(
    player: PlayerClass,
    mission: MissionClass,
    events: MissionEventType[],
    getItemFn: (att: string) => Promise<any>
  ) {
    if (mission.cost > player.energy.current) {
      return {
        success: false,
        message: "Nicht genug Energie, um die Mission zu starten",
        player,
      };
    }

    player.substractEnergy(mission.cost);

    const missionFeedback = mission.checkSuccess(player);
    if (!missionFeedback) throw new Error("Error determing mission success");

    if (missionFeedback.success) {
      player.addXP(mission.xp);
    }

    const eventFeedback = await mission.callEvents(player, events, getItemFn);

    for (const e of eventFeedback) {
      if (e.item?.quantity) player.addItemToInventory(e.item);
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
