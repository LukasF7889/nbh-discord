import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import Player from "../models/player.js";

export const mythTypes = {
  Geist: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 6,
      strength: 3,
      intelligence: 6,
      dexterity: 4,
      perception: 6,
    },
  },

  Macht: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 3,
      strength: 7,
      intelligence: 3,
      dexterity: 6,
      perception: 6,
    },
  },

  Schatten: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 3,
      strength: 5,
      intelligence: 4,
      dexterity: 7,
      perception: 6,
    },
  },

  Glanz: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 7,
      strength: 3,
      intelligence: 5,
      dexterity: 4,
      perception: 6,
    },
  },

  Wildnis: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 3,
      strength: 6,
      intelligence: 3,
      dexterity: 7,
      perception: 6,
    },
  },

  Glaube: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 7,
      strength: 3,
      intelligence: 5,
      dexterity: 4,
      perception: 6,
    },
  },

  Mysterium: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 4,
      strength: 3,
      intelligence: 7,
      dexterity: 5,
      perception: 6,
    },
  },

  Ordnung: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 4,
      strength: 5,
      intelligence: 5,
      dexterity: 3,
      perception: 8,
    },
  },

  Innovation: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 4,
      strength: 3,
      intelligence: 7,
      dexterity: 5,
      perception: 6,
    },
  },

  Rebellion: {
    energy: { max: 100, current: 100 },
    skills: {
      charisma: 3,
      strength: 6,
      intelligence: 3,
      dexterity: 7,
      perception: 6,
    },
  },
};

export const data = new SlashCommandBuilder()
  .setName("profil")
  .setDescription(
    "Zeigt dein Spielerprofil an oder erstellt eins, wenn du noch keins hast."
  );

export async function execute(interaction) {
  const discordId = interaction.user.id;
  let player = await Player.findOne({ discordId });

  if (!player) {
    const modal = new ModalBuilder()
      .setCustomId("createProfileModal")
      .setTitle("Neues Profil erstellen");

    const nameInput = new TextInputBuilder()
      .setCustomId("mythosName")
      .setLabel("Mythos Name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
    return;
  }

  // Profil anzeigen
  await interaction.reply(`🧙 Profil von ${player.username}:
• XP: ${player.xp}
• Energie: ${player.energy.max}
• Charisma: ${player.skills.charisma}
• Strength: ${player.skills.strength}
• Intelligence: ${player.skills.intelligence}
• Dexterity: ${player.skills.dexterity}
• Perception: ${player.skills.perception}
• Items: ${player.items.map((i) => i.name).join(", ") || "Keine"}
• Mythos-Typ: ${player.type}`);
}
