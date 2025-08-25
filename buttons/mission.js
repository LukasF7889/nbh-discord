import Mission from "../models/mission.js";
import { toMissionClass } from "../models/mission.js";
import MissionClass from "../classes/entities/MissionClass.js";
import Player from "../models/player.js";
import checkMissionSuccess from "../utils/checkMissionSuccess.js";
import callEvents from "../utils/callEvents.js";
import { EmbedBuilder, Events } from "discord.js";
import addItemToInventory from "../utils/addItemToInventory.js";
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
    const missionDoc = await MissionRepository.findById(missionId);
    mission = toMissionClass(missionDoc);
    playerId = interaction.user.id;
    player = await PlayerRepository.findOne(playerId);
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

  const events = await EventService.getRandomEvents(mission.duration);
  const missionResult = await MissionService.startMission(
    player,
    mission,
    events,
    getItem
  );

  //Check mission success
  const feedback = checkMissionSuccess(player, mission);

  //Mission end
  if (feedback.success) {
    modPlayer.xp += mission?.xp;

    //Call events
    const eventFeedback = await callEvents(player, mission);
    const eventReport = [];

    for (let i = 0; i < eventFeedback.length; i++) {
      const e = eventFeedback[i];
      if (e.item && e.item.quantity) await addItemToInventory(player, e.item);
      eventReport.push(
        `**Event ${i + 1}:** ${e.description}\n` +
          `> 🎯 ${e.type}: \`${e.playerValue} + ${e.dice} = ${e.total}/${
            e.difficulty
          }\` ➝ ${e.isSuccess ? "✅ Erfolg" : "❌ Fehlschlag"} ${
            e.item ? `Item erhalten: ${e.item.name} x${e.item.quantity}` : ""
          }`
      );
    }

    //Update player
    player.xp = modPlayer.xp;
    player.energy = modPlayer.energy;
    const newPlayer = await player.save();

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
      {
        $set: {
          energy: modPlayer.energy,
        },
      },
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
