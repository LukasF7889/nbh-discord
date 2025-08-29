import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";

export const data = new SlashCommandBuilder()
  .setName("spa")
  .setDescription("Erhole dich und erhalte Energie zurück");

export const execute = async (interaction) => {
  const discordId = interaction.user.id;
  const player = await PlayerRepository.findByDiscordId(discordId);
  if (!player) return;

  const rows = [];
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`spa:30`)
      .setLabel("30⚡| 30💰")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`spa:full`)
      .setLabel("Full⚡| 100💰")
      .setStyle(ButtonStyle.Primary)
  );
  rows.push(row);

  await interaction.reply({
    content: `Willkommen im Spa! Entspanne dich und erhalte Energie zurück. Deine Energie: ${player.energy.current}/${player.energy.max}`,
    components: rows,
  });
};
