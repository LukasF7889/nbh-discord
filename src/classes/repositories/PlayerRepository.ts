import Player from "../../models/player.js";
import { toPlayerClass } from "../../models/player.js";
import type { PlayerType } from "../../types/playerType.js";
import PlayerClass from "../entities/PlayerClass.js";

class PlayerRepository {
  async findByDiscordId(discordId: string): Promise<PlayerClass | null> {
    const playerDoc = await Player.findOne({ discordId });
    if (!playerDoc) return null;
    return toPlayerClass(playerDoc);
  }

  async create(player: PlayerClass): Promise<PlayerClass> {
    const playerDoc = await Player.create(player.toObject());
    const playerClass = toPlayerClass(playerDoc);
    if (!playerClass) throw new Error("Failed to create player");
    return playerClass;
  }

  async save(player: PlayerClass): Promise<PlayerClass> {
    const updated = await Player.findOneAndUpdate(
      { discordId: player.discordId },
      player.toObject(),
      { new: true }
    );
    const playerClass = toPlayerClass(updated);
    if (!playerClass) throw new Error("Failed to save player");
    return playerClass;
  }
}

export default new PlayerRepository();
