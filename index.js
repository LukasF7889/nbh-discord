import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize Discord Client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Loading all commands from the commands directory
const commandsPath = path.join("./commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.resolve(commandsPath, file);
  const command = await import(`file://${filePath.replace(/\\/g, "/")}`);
  if ("data" in command && "execute" in command)
    client.commands.set(command.data.name, command);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

client.on("ready", async () => {
  console.log(`🤖 Eingeloggt als ${client.user.tag}`);

  // Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  const commandsData = client.commands.map((cmd) => cmd.data.toJSON());

  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      console.error(
        "❌ Bot ist auf dem Guild nicht vorhanden! Bitte erneut einladen."
      );
      return;
    }

    console.log("⏳ Lade Slash-Commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commandsData }
    );
    console.log("✅ Slash-Commands geladen!");
  } catch (error) {
    if (error.code === 50001) {
      console.error(
        "❌ Missing Access: Bot hat keine Berechtigung, Slash-Commands auf diesem Guild zu registrieren."
      );
    } else {
      console.error(error);
    }
  }
});

//Event handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const eventModule = await import(`file://${filePath.replace(/\\/g, "/")}`);
  const event = eventModule.default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
