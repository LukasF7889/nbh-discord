import { MessageFlags } from "discord.js";
import PlayerRepository from "../classes/repositories/PlayerRepository.js";
const handleSpa = async (interaction, args) => {
    const [amountStr] = args;
    let playerId;
    let player;
    let updatedPlayer;
    try {
        playerId = interaction.user.id;
        player = await PlayerRepository.findByDiscordId(playerId);
        if (!player)
            throw new Error("Player not found");
    }
    catch (error) {
        console.error(error);
        return;
    }
    if (player.energy.current >= player.energy.max) {
        return await interaction.reply({
            content: `Du hast bereits volle Energie!`,
            flags: MessageFlags.Ephemeral,
        });
    }
    if (amountStr === "full") {
        player.restoreEnergy();
    }
    else {
        const amount = parseInt(amountStr, 10);
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid energy amount. Could not restore");
        }
        player.addEnergy(amount);
    }
    updatedPlayer = await PlayerRepository.save(player);
    await interaction.reply({
        content: `Du hast dich erholt und hast jetzt ${updatedPlayer.energy.current} / ${updatedPlayer.energy.max} Energie`,
        flags: MessageFlags.Ephemeral,
    });
};
export default handleSpa;
//# sourceMappingURL=spa.js.map