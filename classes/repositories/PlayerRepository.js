import Player from "../../models/player.js";

class PlayerRepository {
  async findByDiscordId(discordId) {
    return await Player.findOne({ dicordId });
  }

  async save(player) {
    return await player.save();
  }
}

export default new PlayerRepository();
