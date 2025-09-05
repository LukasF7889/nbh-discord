import Player from "../../models/player.js";
import { toPlayerClass } from "../../models/player.js";
class PlayerRepository {
    async findByDiscordId(discordId) {
        const playerDoc = await Player.findOne({ discordId });
        if (!playerDoc)
            return null;
        return toPlayerClass(playerDoc);
    }
    async create(player) {
        const playerDoc = await Player.create(player.toObject());
        const playerClass = toPlayerClass(playerDoc);
        if (!playerClass)
            throw new Error("Failed to create player");
        return playerClass;
    }
    async save(player) {
        const updated = await Player.findOneAndUpdate({ discordId: player.discordId }, player.toObject(), { new: true });
        const playerClass = toPlayerClass(updated);
        if (!playerClass)
            throw new Error("Failed to save player");
        return playerClass;
    }
}
export default new PlayerRepository();
//# sourceMappingURL=PlayerRepository.js.map