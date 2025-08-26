import Player from "../../models/player.js";

class PlayerRepository {
  async findByDiscordId(discordId) {
    return await Player.findOne({ dicordId });
  }

  async create(player) {
    await PlayerRepository.create(player);
  }

  async save(player) {
    return await player.save();
  }
}

export default new PlayerRepository();
