import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import mission from "../models/mission.js";

export const data = new SlashCommandBuilder()
  .setName("aushang")
  .setDescription("Zeigt die aktuellen Missionen an.");

export const execute = async (interaction) => {
  const missionList = await mission.find();
  if (missionList.length === 0) {
    await interaction.reply("Es gibt derzeit keine aktiven Missionen.");
    return;
  }

  const missionDescriptions = missionList.map(
    (m) =>
      `**${m.title}**: ${m.description} (Dauer: ${m.duration} Minuten, ${m.difficulty})`
  );

  const rows = [];
  for (let i = 0; i < missionDescriptions.length; i += 5) {
    const row = new ActionRowBuilder();
    row.addComponents(
      missionList
        .slice(i, i + 5)
        .map((m) =>
          new ButtonBuilder()
            .setCustomId(`mission:${m._id}`)
            .setLabel(m.title)
            .setStyle(ButtonStyle.Primary)
        )
    );
    rows.push(row);
  }

  await interaction.reply({
    content:
      "Hier sind die aktuellen Missionen: \n" + missionDescriptions.join("\n"),
    components: rows,
  });
};
