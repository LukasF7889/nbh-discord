// // Register Slash Commands
// const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
// const commandsData = client.commands.map((cmd) => cmd.data.toJSON());
export {};
// try {
//   const guild = client.guilds.cache.get(process.env.GUILD_ID);
//   if (!guild) {
//     console.error(
//       "❌ Bot ist auf dem Guild nicht vorhanden! Bitte erneut einladen."
//     );
//     return;
//   }
//   console.log("⏳ Lade Slash-Commands...");
//   await rest.put(
//     Routes.applicationGuildCommands(
//       process.env.CLIENT_ID,
//       process.env.GUILD_ID
//     ),
//     { body: commandsData }
//   );
//   console.log("✅ Slash-Commands geladen!");
// } catch (error) {
//   if (error.code === 50001) {
//     console.error(
//       "❌ Missing Access: Bot hat keine Berechtigung, Slash-Commands auf diesem Guild zu registrieren."
//     );
//   } else {
//     console.error(error);
//   }
// }
//# sourceMappingURL=register-commands.js.map