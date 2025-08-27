import { SlashCommandBuilder } from "discord.js";
import BlackboardService from "../classes/services/BlackboardService.js";
import MissionPresenter from "../classes/presenter/MissionPresenter.js";

export const data = new SlashCommandBuilder()
  .setName("aushang")
  .setDescription("Zeigt die aktuellen Missionen an.");

export const execute = async (interaction) => {
  try {
    const blackboard = await BlackboardService.getBlackboard();
    const missionList = blackboard.currentMissions;

    console.log("lastUpdated:", blackboard.lastUpdated);
    console.log("refreshTime ms:", blackboard.refreshTime);
    console.log("getRefreshTime:", blackboard.getRefreshTime());

    if (!missionList || missionList.length === 0) {
      return await interaction.reply("⚠️ Es gibt aktuell keine Missionen.");
    }

    const { description, rows } = MissionPresenter.presentMissionList(
      missionList,
      blackboard
    );

    console.log("hi du");

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
