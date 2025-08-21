import Mission from "../models/mission.js";
import Player from "../models/player.js";
import checkMissionSuccess from "../utils/checkMissionSuccess.js";
import callEvents from "../utils/callEvents.js";
import { EmbedBuilder } from "discord.js";

const handleStartMission = async (interaction, args) => {
  const [missionId] = args;

  let mission;
  let playerId;
  let player;
  let modPlayer;

  try {
    mission = await Mission.findById(missionId);
    playerId = interaction.user.id;
    player = await Player.findOne({ discordId: playerId });
    modPlayer = player;
    console.log(mission);
  } catch (error) {
    console.error(error);
    return;
  }

  if (!mission)
    return interaction.reply({
      content: "Die Mission wurde nicht gefunden",
      ephemeral: true,
    });

  //Mission start
  if (mission.cost > player.energy) {
    return interaction.reply({
      content: `Nicht genug Energie, um diese Mission zu starten`,
      ephemeral: true,
    });
  } else {
    modPlayer.energy -= mission.cost;
  }

  await interaction.reply({
    content: `Du hast die Mission ${mission.title} gestartet!`,
    ephemeral: true,
  });

  //Check mission success
  const feedback = checkMissionSuccess(player, mission);
  console.log(feedback);

  //Mission end
  if (feedback.success) {
    modPlayer.xp += mission?.xp;

    //Call events
    const eventFeedback = await callEvents(player, mission);
    const eventReport = [];

    eventFeedback.map((e, i) => {
      eventReport.push(
        `**Event ${i + 1}:** ${e.description}\n` +
          `> 🎯 ${e.type}: \`${e.playerValue} + ${e.dice} = ${e.total}/${
            e.difficulty
          }\` ➝ ${e.isSuccess ? "✅ Erfolg" : "❌ Fehlschlag"}`
      );
    });

    const newPlayer = await Player.findOneAndUpdate(
      { discordId: playerId },
      { $set: { xp: modPlayer.xp, energy: modPlayer.energy } },
      { new: true }
    );
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(`✅ Mission abgeschlossen: ${mission.title}`)
          .setColor(0x00ff99) // Grün für Erfolg
          .addFields(
            {
              name: "Belohnung",
              value: `✨ **${mission.xp} XP** verdient\n*(du hast nun ${newPlayer.xp} XP)*`,
              inline: false,
            },
            {
              name: "Energie",
              value: `⚡ ${newPlayer.energy} verbleibend`,
              inline: false,
            },
            {
              name: "Events",
              value:
                eventReport.length > 0
                  ? eventReport.join("\n")
                  : "Keine besonderen Ereignisse",
              inline: false,
            }
          )
          .setFooter({ text: "Gut gemacht, Held!" })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  } else if (!feedback.success) {
    const newPlayer = await Player.findOneAndUpdate(
      { discordId: playerId },
      { $set: { energy: modPlayer.energy } },
      { new: true }
    );
    await interaction.followUp({
      content: `${mission.title} fehlgeschlagen. ${feedback.message}. ${newPlayer.energy} Energie verbleibend.`,
      ephemeral: true,
    });
  } else {
    await interaction.followUp({
      content: `Etwas ist fehlgeschlagen. Mission konnte nicht durchgeführt werden`,
      ephemeral: true,
    });
  }
};

export default handleStartMission;
