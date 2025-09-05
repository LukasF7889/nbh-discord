import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import BlackboardService from "../../classes/services/BlackboardService.js";
import MissionPresenter from "../../classes/presenter/MissionPresenter.js";
import type BlackboardClass from "../../classes/entities/BlackboardClass.js";

export const data = new SlashCommandBuilder()
  .setName("aushang")
  .setDescription("Zeigt die aktuellen Missionen an.");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    const blackboard: BlackboardClass = await BlackboardService.getBlackboard();
    const missionList = blackboard.currentMissions;
    console.log(missionList);

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

    await interaction.reply({
      content: description,
      components: rows,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Fehler beim Laden der Missionen.",
      flags: MessageFlags.Ephemeral,
    });
  }
};
