import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type InteractionReplyOptions,
} from "discord.js";
import PlayerRepository from "../../classes/repositories/PlayerRepository.js";
import DojoPresenter from "../../classes/presenter/DojoPresenter.js";
import type PlayerClass from "../../classes/entities/PlayerClass.js";

export const data = new SlashCommandBuilder()
  .setName("dojo")
  .setDescription("Train your body and mind to increade power");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const discordId = interaction.user.id;
  const player: PlayerClass | null = await PlayerRepository.findByDiscordId(
    discordId
  );
  if (!player) return;

  const spaMessage: InteractionReplyOptions = DojoPresenter.presentDojo(player);
  if (!spaMessage) {
    await interaction.reply({
      content: "Es gibt grad n Fehler im Dojo, komm später wieder",
      flags: MessageFlags.Ephemeral,
    });
  }
  console.log(spaMessage);

  await interaction.reply(spaMessage);
};
