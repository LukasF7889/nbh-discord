// Require the necessary discord.js classes
import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  ChatInputCommandInteraction,
  MessageFlags,
  Events,
} from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();

const { MONGO_URI, DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!MONGO_URI || !DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error("Missing required environment variables!");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Dynamically retrieve command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(pathToFileURL(filePath).href);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Register Slash Commands
client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user!.tag}`);

  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  const commandsData = Array.from(client.commands.values()).map((cmd) =>
    cmd.data.toJSON()
  );
});

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
