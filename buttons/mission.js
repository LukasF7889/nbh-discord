import Mission from "../models/mission.js";
import Player from "../models/player.js";

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

  //Mission end
  modPlayer.xp += mission?.xp;
  const newPlayer = await Player.findOneAndUpdate(
    { discordId: playerId },
    { $set: { xp: modPlayer.xp, energy: modPlayer.energy } },
    { new: true }
  );
  await interaction.followUp({
    content: `${mission.title} erfolgreich abgeschlossen. ${mission.xp}XP verdient (du hast nun ${newPlayer.xp}XP). ${newPlayer.energy} Energie verbleibend.`,
    ephemeral: true,
  });
};

export default handleStartMission;
