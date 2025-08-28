import { MessageFlags, SlashCommandBuilder } from "discord.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
import DojoPresenter from "../classes/presenter/DojoPresenter.js";

export const data = new SlashCommandBuilder()
  .setName("dojo")
  .setDescription("Train your body and mind to increade power");

export const execute = async (interaction) => {
  const discordId = interaction.user.id;
  const player = await PlayerRepository.findByDiscordId(discordId);
  if (!player) return;

  const spaMessage = DojoPresenter.presentDojo(player);
  if (!spaMessage) {
    await interaction.reply({
      content: "Es gibt grad n Fehler im Dojo, komm später wieder",
      flag: MessageFlags.Ephemeral,
    });
  }
  console.log(spaMessage);

  await interaction.reply(spaMessage);
};
