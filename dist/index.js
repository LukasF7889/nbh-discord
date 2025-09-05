// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Collection, REST, Events, } from "discord.js";
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
async function loadCommands(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await loadCommands(fullPath); // recurse into subfolder
        }
        else if (entry.isFile() &&
            (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
            const module = await import(pathToFileURL(fullPath).href);
            const command = module.default ?? module;
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            }
            else {
                console.log(`[WARNING] ${fullPath} missing data or execute`);
            }
        }
    }
}
// Usage
const commandsPath = path.join(__dirname, "commands");
await loadCommands(commandsPath);
console.log("All commands loaded:", Array.from(client.commands.keys()));
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
// Import events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const mod = await import(pathToFileURL(filePath).href);
    const event = mod.default ?? mod; //fallback, if event is wrote as default export
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;
//   const command = interaction.client.commands.get(interaction.commandName);
//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }
//   try {
//     console.log(interaction);
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   }
// });
// Connect MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo Error:", err));
// Register Slash Commands
client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
    const commandsData = Array.from(client.commands.values()).map((cmd) => cmd.data.toJSON());
});
// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
//# sourceMappingURL=index.js.map