import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import BlackboardService from "../classes/services/BlackboardService";
import MissionPresenter from "../classes/presenter/MissionPresenter";

export const data = new SlashCommandBuilder()
  .setName("aushang")
  .setDescription("Zeigt die aktuellen Missionen an.");

export const execute = async (interaction) => {
  try {
    const missionList = await BlackboardService.getMissions();

    if (!missionList || missionList.length === 0) {
      return await interaction.reply("⚠️ Es gibt aktuell keine Missionen.");
    }

    const { description, rows } =
      MissionPresenter.presentMissionList(missionList);

    await interaction.reply({
      content: description,
      components: rows,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Fehler beim Laden der Missionen.",
      ephemeral: true,
    });
  }
};
