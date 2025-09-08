import { EmbedBuilder, MessageFlags, } from "discord.js";
import MissionService from "../classes/services/MissionService.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import MissionRepository from "../classes/repositories/MissionRepository.js";
import EventService from "../classes/services/EventService.js";
import ItemRepository from "../classes/repositories/ItemRepository.js";
const handleStartMission = async (interaction, args) => {
    const [missionId] = args;
    let mission;
    let playerId;
    let player;
    try {
        mission = await MissionRepository.findById(missionId);
        if (!mission)
            throw new Error("Mission not found");
        playerId = interaction.user.id;
        player = await PlayerRepository.findByDiscordId(playerId);
        if (!player)
            throw new Error("Error: Player not found");
    }
    catch (error) {
        console.error(error);
        return;
    }
    if (!mission)
        await interaction.reply({
            content: "Die Mission wurde nicht gefunden",
            flags: MessageFlags.Ephemeral,
        });
    try {
        const events = await EventService.getRandomEvents(mission.duration);
        const missionResult = await MissionService.startMission(player, mission, events, ItemRepository.getItem);
        console.log(missionResult);
        if (!missionResult)
            throw new Error("Error receiving mission results");
        let eventReport = [];
        //Render event result texts
        if (missionResult.success && missionResult.eventFeedback) {
            for (let i = 0; i < missionResult.eventFeedback.length; i++) {
                const e = missionResult.eventFeedback[i];
                eventReport.push(`**Event ${i + 1}:** ${e.description}\n` +
                    `> 🎯 ${e.type}: \`${e.playerValue} + ${e.dice} = ${e.total}/${e.difficulty}\` ➝ ${e.isSuccess ? "✅ Erfolg" : "❌ Fehlschlag"} ${e.item ? `Item erhalten: ${e.item.name} x${e.item.quantity}` : ""}`);
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`✅ Mission abgeschlossen: ${mission.title}`)
                        .setColor(0x00ff99) // Grün für Erfolg
                        .addFields({
                        name: "Belohnung",
                        value: `✨ **${mission.xp} XP** verdient\n*(du hast nun ${player.xp} XP)*`,
                        inline: false,
                    }, {
                        name: "Energie",
                        value: `⚡ ${player.energy.current} / ${player.energy.max} verbleibend`,
                        inline: false,
                    }, {
                        name: "Events",
                        value: eventReport.length > 0
                            ? eventReport.join("\n")
                            : "Keine besonderen Ereignisse",
                        inline: false,
                    })
                        .setFooter({ text: "Gut gemacht, Held!" })
                        .setTimestamp(),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
        else if (!missionResult.success) {
            const message = missionResult.missionFeedback?.message || missionResult.message; //Did the mission run? If yes show mission feedback, if no show energy feedback
            await interaction.reply({
                content: `${message}. ${player.energy.current} Energie verbleibend.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        else {
            await interaction.reply({
                content: `Etwas ist fehlgeschlagen. Mission konnte nicht durchgeführt werden`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            await interaction.reply({
                content: error.message,
                flags: MessageFlags.Ephemeral,
            });
        }
        else {
            console.error("Unknown error occured");
        }
    }
};
export default handleStartMission;
//# sourceMappingURL=mission.js.map