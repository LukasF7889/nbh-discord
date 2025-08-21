import Player from "../models/player.js";
import { mythTypes } from "../commands/profile.js";

const handleCreateProfile = async (interaction, args) => {
  const [userId, mythosType, mythosName] = args;
  const startValues = mythTypes[mythosType];
  const discordId = interaction.user.id;

  await Player.create({
    id: userId,
    discordId: discordId,
    username: interaction.user.username,
    mythos: mythosName,
    type: mythosType,
    ...startValues,
    items: [],
    xp: 0,
  });

  await interaction.update({
    content: `✅ Profil erstellt! Willkommen ${mythosName} (${mythosType})`,
    components: [],
  });
};

export default handleCreateProfile;
