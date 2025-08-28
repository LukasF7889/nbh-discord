import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import calcAttributeCost from "../../utils/calcAttributeCost.js";
import { ticketMap } from "../../utils/gameMaps.js";

class DojoPresenter {
  static getButton(att) {
    return new ButtonBuilder()
      .setCustomId(`dojo:${att}`)
      .setLabel(`⬆️${att}`)
      .setStyle(ButtonStyle.Primary);
  }

  static buildRows(player) {
    const buttonArr = [];
    const rows = [];
    const itemCounts = {};

    for (const att in player.skills) {
      const checkUpgrade = player.checkAttributeUpgrade(att);
      console.log(checkUpgrade);
      itemCounts[att] = checkUpgrade.invQuantity;
      console.log(itemCounts);
      if (checkUpgrade.isEligable) {
        buttonArr.push(att);
      }
    }

    for (let i = 0; i < buttonArr.length; i += 5) {
      const row = new ActionRowBuilder();
      row.addComponents(
        buttonArr.slice(i, i + 5).map((a) => {
          return this.getButton(a);
        })
      );
      rows.push(row);
    }
    return { rows, itemCounts };
  }

  static presentDojo(player) {
    const { rows, itemCounts } = this.buildRows(player);
    if (!rows) throw new Error("Button row creation failed");

    const description = Object.keys(player.skills)
      .map(
        (att) =>
          `${att.charAt(0).toUpperCase() + att.slice(1)}: ${
            player.skills[att]
          }. => ${itemCounts[att]} / ${calcAttributeCost(
            player.skills[att]
          )} Tickets`
      )
      .join("\n");

    return {
      content: `Zeit mal wieder zu pumpen, wa?\n${description}`,
      components: rows,
    };
  }
}

export default DojoPresenter;
