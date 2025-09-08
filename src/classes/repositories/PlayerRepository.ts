import PlayerClass, { PlayerModel } from "../entities/PlayerClass.js";

class PlayerRepository {
  async findByDiscordId(discordId: string): Promise<PlayerClass | null> {
    const playerDoc = await PlayerModel.findOne({ discordId });
    if (!playerDoc) return null;
    return PlayerClass.fromDoc(playerDoc);
  }

  async create(player: PlayerClass): Promise<PlayerClass> {
    const playerDoc = await PlayerModel.create(player.toObject());
    const playerClass = PlayerClass.fromDoc(playerDoc);
    if (!playerClass) throw new Error("Failed to create player");
    return playerClass;
  }

  async save(player: PlayerClass): Promise<PlayerClass> {
    const updated = await PlayerModel.findOneAndUpdate(
      { discordId: player.discordId },
      player.toObject(),
      { new: true }
    );
    const playerClass = PlayerClass.fromDoc(updated);
    if (!playerClass) throw new Error("Failed to save player");
    return playerClass;
  }
}

export default new PlayerRepository();
