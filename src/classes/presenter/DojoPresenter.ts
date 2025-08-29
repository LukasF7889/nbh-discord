import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import calcAttributeCost from "../../config/calcAttributeCost.js";
import type PlayerClass from "../entities/PlayerClass.js";
import type { PlayerType } from "../../types/playerType.js";

class DojoPresenter {
  static getButton(att: keyof PlayerClass["skills"] | "levelup") {
    return new ButtonBuilder()
      .setCustomId(`dojo:${att}`)
      .setLabel(`⬆️${att}`)
      .setStyle(ButtonStyle.Primary);
  }

  static buildRows(player: PlayerClass) {
    const buttonArr: (keyof PlayerClass["skills"] | "levelup")[] = [];
    const rows = [];
    const itemCounts: Record<string, number> = {}; //itemCounts is an object with string keys and number values

    //Check if attribute upgrade is possible
    for (const [att, value] of Object.entries(player.skills)) {
      const key = att as keyof PlayerClass["skills"];
      const checkUpgrade = player.checkAttributeUpgrade(key);
      itemCounts[att] = checkUpgrade.invQuantity;
      console.log(itemCounts);
      if (checkUpgrade.isEligable) {
        buttonArr.push(key);
      }
    }

    //Check if levelup is possible
    if (player.checkLevelup()) {
      buttonArr.push("levelup");
    }

    for (let i = 0; i < buttonArr.length; i += 5) {
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        buttonArr.slice(i, i + 5).map((a) => {
          return this.getButton(a);
        })
      );
      rows.push(row);
    }
    return { rows, itemCounts };
  }

  static presentDojo(player: PlayerClass) {
    const { rows, itemCounts } = this.buildRows(player);
    if (!rows) throw new Error("Button row creation failed");

    const description = Object.entries(player.skills)
      .map(
        ([att, value]) =>
          `${att.charAt(0).toUpperCase() + att.slice(1)}: ${value} => ${
            itemCounts[att]
          } / ${calcAttributeCost(value)} Tickets`
      )
      .join("\n");

    return {
      content: `Zeit mal wieder zu pumpen, wa?\n${description}`,
      components: rows.map((r) => r.toJSON()),
    };
  }
}

export default DojoPresenter;
