import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, } from "discord.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
export const data = new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Zeigt dein Spielerprofil an oder erstellt eins, wenn du noch keins hast.");
export async function execute(interaction) {
    const discordId = interaction.user.id;
    let player = await PlayerRepository.findByDiscordId(discordId);
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
    const embed = new EmbedBuilder()
        .setTitle(`🧙 Profil von ${player.username}`)
        .setColor(0x5865f2)
        .addFields({ name: "XP", value: `${player.xp}`, inline: true }, {
        name: "Energie",
        value: `${player.energy.current}/${player.energy.max}`,
        inline: true,
    }, { name: "Mythos-Typ", value: player.type, inline: true }, { name: "Charisma", value: `${player.skills.charisma}`, inline: true }, { name: "Strength", value: `${player.skills.strength}`, inline: true }, {
        name: "Intelligence",
        value: `${player.skills.intelligence}`,
        inline: true,
    }, { name: "Dexterity", value: `${player.skills.dexterity}`, inline: true }, {
        name: "Perception",
        value: `${player.skills.perception}`,
        inline: true,
    }, {
        name: "Items",
        value: player.items.map((i) => `${i.name} x${i.quantity}`).join(", ") ||
            "Keine",
    });
    await interaction.reply({ embeds: [embed] });
}
//# sourceMappingURL=profile.js.map