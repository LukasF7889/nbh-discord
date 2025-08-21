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
    energy: 100,
    charisma: 10,
    strength: 5,
    intelligence: 10,
    dexterity: 5,
    perception: 10,
  },
  Macht: {
    energy: 120,
    charisma: 5,
    strength: 15,
    intelligence: 5,
    dexterity: 10,
    perception: 5,
  },
  Schatten: {
    energy: 80,
    charisma: 5,
    strength: 10,
    intelligence: 10,
    dexterity: 15,
    perception: 10,
  },
  Glanz: {
    energy: 90,
    charisma: 15,
    strength: 5,
    intelligence: 10,
    dexterity: 5,
    perception: 10,
  },
  Wildnis: {
    energy: 100,
    charisma: 5,
    strength: 10,
    intelligence: 5,
    dexterity: 15,
    perception: 10,
  },
  Glaube: {
    energy: 100,
    charisma: 15,
    strength: 5,
    intelligence: 10,
    dexterity: 5,
    perception: 5,
  },
  Mysterium: {
    energy: 80,
    charisma: 10,
    strength: 5,
    intelligence: 15,
    dexterity: 10,
    perception: 10,
  },
  Ordnung: {
    energy: 100,
    charisma: 10,
    strength: 10,
    intelligence: 10,
    dexterity: 5,
    perception: 5,
  },
  Innovation: {
    energy: 90,
    charisma: 10,
    strength: 5,
    intelligence: 15,
    dexterity: 10,
    perception: 10,
  },
  Rebellion: {
    energy: 110,
    charisma: 5,
    strength: 10,
    intelligence: 5,
    dexterity: 15,
    perception: 10,
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
• Energie: ${player.energy}
• Charisma: ${player.charisma}
• Strength: ${player.strength}
• Intelligence: ${player.intelligence}
• Dexterity: ${player.dexterity}
• Perception: ${player.perception}
• Items: ${player.items.map((i) => i.name).join(", ") || "Keine"}
• Mythos-Typ: ${player.type}`);
}
