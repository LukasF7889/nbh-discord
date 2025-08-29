import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type PlayerClass from "../classes/entities/PlayerClass.js";

export const data = new SlashCommandBuilder()
  .setName("spa")
  .setDescription("Erhole dich und erhalte Energie zurück");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const discordId = interaction.user.id;
  const player: PlayerClass | null = await PlayerRepository.findByDiscordId(
    discordId
  );
  if (!player) return;

  const rows: ActionRowBuilder<ButtonBuilder>[] = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("spa:30")
        .setLabel("30⚡| 30💰")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("spa:full")
        .setLabel("Full⚡| 100💰")
        .setStyle(ButtonStyle.Primary)
    ),
  ];

  await interaction.reply({
    content: `Willkommen im Spa! Entspanne dich und erhalte Energie zurück. Deine Energie: ${player.energy.current}/${player.energy.max}`,
    components: rows,
  });
};
