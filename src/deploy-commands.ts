import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Fail fast if required environment variables are missing
if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error(
    "❌ Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env file"
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands: any[] = [];

// Path to the commands directory
const foldersPath = path.join(__dirname, "commands");
// Read all entries (files + folders) inside /commands
const commandFolders = fs.readdirSync(foldersPath, { withFileTypes: true });

for (const entry of commandFolders) {
  if (entry.isDirectory()) {
    // Handle commands stored inside subfolders (e.g. commands/admin/ban.ts)
    const commandsPath = path.join(foldersPath, entry.name);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // Convert absolute path to file:// URL for dynamic import in ESM
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.default ?? commandModule;

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing "data" or "execute".`
        );
      }
    }
  } else if (
    entry.isFile() &&
    (entry.name.endsWith(".js") || entry.name.endsWith(".ts"))
  ) {
    // Handle commands stored directly in /commands (no subfolder)
    const filePath = path.join(foldersPath, entry.name);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default ?? commandModule;

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing "data" or "execute".`
      );
    }
  }
}

// Prepare the REST client with the bot token
const rest = new REST().setToken(DISCORD_TOKEN);

// Deploy the commands
(async () => {
  try {
    console.log(
      `🚀 Started refreshing ${commands.length} application (/) commands.`
    );

    const data: any = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("❌ Error deploying commands:", error);
  }
})();
