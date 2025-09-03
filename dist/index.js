import { Client, GatewayIntentBits, Collection, REST, Routes, } from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import isDiscordRestError from "./utils/isDiscordRestError.js";
// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//Check env variables for TS
if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI missing!");
if (!process.env.DISCORD_TOKEN)
    throw new Error("DISCORD_TOKEN missing!");
if (!process.env.GUILD_ID)
    throw new Error("GUILD_ID missing!");
if (!process.env.CLIENT_ID)
    throw new Error("CLIENT_ID missing!");
const MONGO_URI = process.env.MONGO_URI;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;
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
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    //set default export to a Command type
    const command = commandModule.default;
    // Add commands collection
    client.commands.set(command.data.name, command);
}
// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo Error:", err));
client.on("ready", async () => {
    console.log(`🤖 Eingeloggt als ${client.user.tag}`);
    // Register Slash Commands
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
    const commandsData = Array.from(client.commands.values()).map((cmd) => cmd.data.toJSON());
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
            console.error("❌ Bot ist auf dem Guild nicht vorhanden! Bitte erneut einladen.");
            return;
        }
        console.log("⏳ Lade Slash-Commands...");
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commandsData,
        });
        console.log("✅ Slash-Commands geladen!");
    }
    catch (error) {
        if (isDiscordRestError(error) && error.code === 50001) {
            console.error("❌ Missing Access: Bot hat keine Berechtigung, Slash-Commands auf diesem Guild zu registrieren.");
        }
        else {
            console.error(error);
        }
    }
});
//Event handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const eventModule = await import(`file://${filePath}`);
    const event = eventModule.default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.login(DISCORD_TOKEN);
//# sourceMappingURL=index.js.map