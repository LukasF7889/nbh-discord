import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import PlayerClass from "../classes/entities/PlayerClass.js"; // Importiere die Player-Klasse
import { mythTypes } from "../config/mythTypes.js";
import { ButtonInteraction } from "discord.js";

const handleCreateProfile = async (
  interaction: ButtonInteraction,
  args: string[]
) => {
  const [userId, mythosTypeStr, mythosName] = args;
  if (!(mythosTypeStr in mythTypes)) throw new Error("Invalid mythos type");
  type MythType = keyof typeof mythTypes;
  const mythosType = mythosTypeStr as MythType;
  const startValues = mythTypes[mythosType];
  const discordId = interaction.user.id;

  // Create a player object
  const playerObj = new PlayerClass({
    discordId: discordId,
    level: 1,
    username: interaction.user.username,
    mythos: mythosName,
    type: mythosType,
    ...startValues,
    money: 0,
    items: [],
    xp: 0,
  });

  // Save player object into database
  await PlayerRepository.create(playerObj);

  await interaction.update({
    content: `✅ Profil erstellt! Willkommen ${mythosName} (${mythosType})`,
    components: [],
  });
};

export default handleCreateProfile;
