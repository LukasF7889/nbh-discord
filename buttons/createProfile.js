import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import Player from "../classes/entities/PlayerClass.js"; // Importiere die Player-Klasse
import { mythTypes } from "../commands/profile.js";

const handleCreateProfile = async (interaction, args) => {
  const [userId, mythosType, mythosName] = args;
  const startValues = mythTypes[mythosType];
  const discordId = interaction.user.id;

  // Create a player object
  const playerObj = new Player({
    id: userId,
    discordId: discordId,
    level: 1,
    username: interaction.user.username,
    mythos: mythosName,
    type: mythosType,
    ...startValues,
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
