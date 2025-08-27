import Player from "../../models/player.js";
import { toPlayerClass } from "../../models/player.js";

class PlayerRepository {
  async findByDiscordId(discordId) {
    const playerDoc = await Player.findOne({ discordId });
    if (!playerDoc) return null;
    return toPlayerClass(playerDoc);
  }

  async create(player) {
    const playerDoc = await Player.create(player.toObject());
    return toPlayerClass(playerDoc);
  }

  async save(player) {
    const updated = await Player.findByIdAndUpdate(
      player._id,
      player.toObject(),
      { new: true }
    );
    return toPlayerClass(updated);
  }
}

export default new PlayerRepository();
