import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import { MessageFlags } from "discord.js";
import { ticketMap } from "../utils/gameMaps.js";

const handleDojo = async (interaction, args) => {
  const [att] = args;
  const playerId = interaction.user.id;
  let player;

  try {
    player = await PlayerRepository.findByDiscordId(playerId);
    if (!player) throw new Error("Player not found");
    const ticket = player.items.find((i) => i.name === ticketMap[att]);
    if (!ticket) throw new Error(`Kein ${ticketMap[att]} vorhanden`);
    const upgradeCheck = player.checkAttributeUpgrade(att);
    if (upgradeCheck.isEligable) {
      await player.removeItemFromInventory(ticket, upgradeCheck.cost);
      await player.increaseAttribute(att);
      await PlayerRepository.save(player);
    } else {
      await interaction.reply({
        content: `Deine Tickets reichen nicht aus.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  await interaction.reply({
    content: `${att} wurde erhöht! Deine ${att} beträgt nun ${player.skills[att]}.`,
    flags: MessageFlags.Ephemeral,
  });
};

export default handleDojo;
