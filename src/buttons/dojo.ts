import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import { ButtonInteraction, MessageFlags } from "discord.js";
import { ticketMap } from "../config/gameMaps.js";
import { itemType } from "../types/itemType.js";
import PlayerClass from "../classes/entities/PlayerClass.js";

const handleDojo = async (interaction: ButtonInteraction, args: string[]) => {
  const [attStr]: string[] = args;
  const playerId = interaction.user.id;
  const att = attStr as keyof PlayerClass["skills"] | "levelup";
  let player;

  try {
    player = await PlayerRepository.findByDiscordId(playerId);
    if (!player) throw new Error("Player not found");

    if (att === "levelup") {
      try {
        if (!player.checkLevelup()) {
          await interaction.reply({
            content: `Du hast noch nicht genug XP für ein Level-Up!`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        player.levelup();
      } catch (error) {
        console.error(error);
      }
    } else {
      const ticket = player.items.find(
        (i: itemType) => i.name === ticketMap[att]
      );
      if (!ticket) throw new Error(`Kein ${ticketMap[att]} vorhanden`);
      const upgradeCheck = player.checkAttributeUpgrade(att);

      if (upgradeCheck.isEligable) {
        try {
          player.removeItemFromInventory(ticket, upgradeCheck.cost);
          await player.increaseAttribute(att);
        } catch (error) {
          console.error(error);
        }
      } else {
        await interaction.reply({
          content: `Deine Tickets reichen nicht aus.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    return;
  }

  await PlayerRepository.save(player);

  const message =
    att === "levelup"
      ? `Level-Up! Du bist jetzt Level ${player.level}.`
      : `${att} wurde erhöht! Deine ${att} beträgt nun ${player.skills[att]}.`;
  await interaction.reply({ content: message, flags: MessageFlags.Ephemeral });
};

export default handleDojo;
