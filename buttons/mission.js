import { toMissionClass } from "../models/mission.js";
import { EmbedBuilder, Events } from "discord.js";
import getItem from "../utils/getItem.js";

import MissionService from "../classes/services/MissionService.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import MissionRepository from "../classes/repositories/MissionRepository.js";
import EventService from "../classes/services/EventService.js";

const handleStartMission = async (interaction, args) => {
  const [missionId] = args;

  let mission;
  let playerId;
  let player;

  try {
    mission = await MissionRepository.findById(missionId);
    // mission = toMissionClass(missionDoc);
    playerId = interaction.user.id;
    player = await PlayerRepository.findByDiscordId(playerId);
  } catch (error) {
    console.error(error);
    return;
  }

  if (!mission)
    return interaction.reply({
      content: "Die Mission wurde nicht gefunden",
      ephemeral: true,
    });

  try {
    const events = await EventService.getRandomEvents(mission.duration);
    const missionResult = await MissionService.startMission(
      player,
      mission,
      events,
      getItem
    );
    let eventReport = [];

    //Render event result texts
    if (missionResult.success) {
      for (let i = 0; i < missionResult.eventFeedback.length; i++) {
        const e = missionResult.eventFeedback[i];
        eventReport.push(
          `**Event ${i + 1}:** ${e.description}\n` +
            `> 🎯 ${e.type}: \`${e.playerValue} + ${e.dice} = ${e.total}/${
              e.difficulty
            }\` ➝ ${e.isSuccess ? "✅ Erfolg" : "❌ Fehlschlag"} ${
              e.item ? `Item erhalten: ${e.item.name} x${e.item.quantity}` : ""
            }`
        );
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`✅ Mission abgeschlossen: ${mission.title}`)
            .setColor(0x00ff99) // Grün für Erfolg
            .addFields(
              {
                name: "Belohnung",
                value: `✨ **${mission.xp} XP** verdient\n*(du hast nun ${player.xp} XP)*`,
                inline: false,
              },
              {
                name: "Energie",
                value: `⚡ ${player.energy.current} / ${player.energy.max} verbleibend`,
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
    } else if (!missionResult.success) {
      const message =
        missionResult.missionFeedback?.message || missionResult.message; //Did the mission run? If yes show mission feedback, if no show energy feedback
      await interaction.reply({
        content: `${message}. ${player.energy.current} Energie verbleibend.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Etwas ist fehlgeschlagen. Mission konnte nicht durchgeführt werden`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
};

export default handleStartMission;
