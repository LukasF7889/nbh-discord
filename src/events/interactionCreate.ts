import {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  MessageFlags,
} from "discord.js";
import { mythTypes } from "../config/mythTypes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to buttons folder (relative to this event file)
const buttonsPath = path.join(__dirname, "../buttons");

// Read button files if folder exists
let buttonFiles: string[] = [];
if (fs.existsSync(buttonsPath)) {
  buttonFiles = fs
    .readdirSync(buttonsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
}

// Map of button handlers
const buttonHandlers: Record<
  string,
  (interaction: Interaction, args: string[]) => Promise<void>
> = {};
for (const file of buttonFiles) {
  const { default: handler } = await import(
    `file://${path.join(buttonsPath, file)}`
  );
  const name = file.replace(/\.(js|ts)$/, "");
  buttonHandlers[name] = handler;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return console.error("Invalid command used.");
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Error executing the command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // Modal submission
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "createProfileModal"
    ) {
      const mythosName = interaction.fields.getTextInputValue("mythosName");
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      const types = Object.keys(mythTypes);

      for (let i = 0; i < types.length; i += 5) {
        const row = new ActionRowBuilder<ButtonBuilder>();
        types.slice(i, i + 5).forEach((type) => {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(
                `createProfile:${interaction.user.id}:${type}:${mythosName}`
              )
              .setLabel(type)
              .setStyle(ButtonStyle.Primary)
          );
        });
        rows.push(row);
      }

      await interaction.reply({
        content: `Choose your Mythos type for **${mythosName}**:`,
        components: rows,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Button click
    if (interaction.isButton()) {
      const [action, ...args] = interaction.customId.split(":");
      const handler = buttonHandlers[action];
      if (!handler) return console.error("No button handler for", action);

      try {
        await handler(interaction, args);
      } catch (error) {
        console.error("Error handling button click:", error);
      }
    }
  },
};
