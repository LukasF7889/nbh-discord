import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  ChatInputCommandInteraction,
  Events as DiscordEvents,
} from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Command } from "./types/commands.js";
import type { Event } from "./types/events.js";

dotenv.config();

const { MONGO_URI, DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!MONGO_URI || !DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error("Missing required environment variables!");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command Collection
client.commands = new Collection<string, Command>();

// Load Commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = await import(`file://${filePath}`);
  const command: Command = commandModule.default ?? commandModule;

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`Skipping invalid command file: ${file}`);
  }
}

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

  try {
    console.log("⏳ Registering Slash Commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commandsData,
    });
    console.log("✅ Slash Commands registered to guild");
  } catch (err) {
    console.error("❌ Error registering commands:", err);
  }
});

// Interaction Handler
client.on(DiscordEvents.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command)
    return console.error(`No command found for ${interaction.commandName}`);

  try {
    await command.execute(interaction as ChatInputCommandInteraction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Error executing command.",
      ephemeral: true,
    });
  }
});

// Load Events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const eventModule = await import(`file://${filePath}`);
  const event: Event = eventModule.default ?? eventModule;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(DISCORD_TOKEN);
