import MissionRepository from "../repositories/MissionRepository.js";
import PlayerRepository from "../repositories/PlayerRepository.js";
class MissionService {
    static async loadMission(missionId) {
        const mission = await MissionRepository.findById(missionId);
        if (!mission)
            return null;
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
        player.subtractEnergy(mission.cost);
        const missionFeedback = mission.checkSuccess(player);
        if (!missionFeedback)
            throw new Error("Error determing mission success");
        if (missionFeedback.success) {
            player.addXP(mission.xp);
        }
        const eventFeedback = await mission.callEvents(player, events, getItemFn);
        if (!eventFeedback)
            throw new Error("Something went wrong with the events");
        for (const e of eventFeedback) {
            if (e.item?.quantity)
                player.addItemToInventory(e.item);
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
//# sourceMappingURL=MissionService.js.map