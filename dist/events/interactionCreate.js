import { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, } from "discord.js";
import { mythTypes } from "../commands/profile.js";
import fs from "fs";
import path from "path";
const buttonsPath = path.join("./buttons");
const buttonFiles = fs
    .readdirSync(buttonsPath)
    .filter((file) => file.endsWith(".js"));
// Load button handlers
const buttonHandlers = {};
for (const file of buttonFiles) {
    const { default: handler } = await import(`../buttons/${file}`);
    const name = file.replace(".js", "");
    buttonHandlers[name] = handler;
}
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Slash-Commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command)
                return console.error("Invalid command used.");
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "Fehler beim Ausführen des Commands!",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
        // Modal Submit
        if (interaction.isModalSubmit() &&
            interaction.customId === "createProfileModal") {
            const mythosName = interaction.fields.getTextInputValue("mythosName");
            const rows = [];
            const types = Object.keys(mythTypes);
            for (let i = 0; i < types.length; i += 5) {
                const row = new ActionRowBuilder();
                types.slice(i, i + 5).forEach((type) => {
                    row.addComponents(new ButtonBuilder()
                        .setCustomId(`createProfile:${interaction.user.id}:${type}:${mythosName}`)
                        .setLabel(type)
                        .setStyle(ButtonStyle.Primary));
                });
                rows.push(row);
            }
            await interaction.reply({
                content: `Wähle deinen Mythos-Typ für **${mythosName}**:`,
                components: rows,
                flags: MessageFlags.Ephemeral,
            });
        }
        // Button Click
        if (interaction.isButton()) {
            const [action, ...args] = interaction.customId.split(":");
            const handler = buttonHandlers[action];
            if (!handler)
                return console.error("Kein Button-Handler für", action);
            await handler(interaction, args);
        }
    },
};
//# sourceMappingURL=interactionCreate.js.map