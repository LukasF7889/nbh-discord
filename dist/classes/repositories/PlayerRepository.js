import PlayerClass, { PlayerModel } from "../entities/PlayerClass.js";
class PlayerRepository {
    async findByDiscordId(discordId) {
        const playerDoc = await PlayerModel.findOne({ discordId });
        if (!playerDoc)
            return null;
        return PlayerClass.fromDoc(playerDoc);
    }
    async create(player) {
        const playerDoc = await PlayerModel.create(player.toPlainObject());
        const playerClass = PlayerClass.fromDoc(playerDoc);
        if (!playerClass)
            throw new Error("Failed to create player");
        return playerClass;
    }
    async save(player) {
        const updated = await PlayerModel.findOneAndUpdate({ discordId: player.discordId }, player.toPlainObject(), { new: true });
        const playerClass = PlayerClass.fromDoc(updated);
        if (!playerClass)
            throw new Error("Failed to save player");
        return playerClass;
    }
}
export default new PlayerRepository();
//# sourceMappingURL=PlayerRepository.js.map