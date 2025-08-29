import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface Command {
  // each command has "data" (structure of the slash command), and execute(the action behind the command)
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
