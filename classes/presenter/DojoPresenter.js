import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import calcAttributeCost from "../../utils/calcAttributeCost.js";

class DojoPresenter {
  static ticketMap = {
    charisma: "Charisma Ticket",
    perception: "Perception Ticket",
    strength: "Strength Ticket",
    intelligence: "Intelligence Ticket",
    dexterity: "Dexterity Ticket",
  };

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
      itemCounts[att] = player.checkItemQuantity(this.ticketMap[att]);
      const checkCost = calcAttributeCost(player.skills[att]);
      if (itemCounts[att] >= checkCost) {
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
