import { ActionRowBuilder } from "discord.js";

class MissionPresenter {
  //Build actionsrows for a mission list
  static buildRows(missionList) {
    const rows = [];
    for (let i = 0; i < missionList.length; i += 5) {
      const row = new ActionRowBuilder();
      //For each mission in missionList get a button from the mission class
      row.addComponents(missionList.slice(i, i + 5).map((m) => m.getButton()));
      rows.push(row);
    }
    return rows;
  }

  //Get a list of all mission descriptions
  static formatList(missionList) {
    return missionList.map((m) => m.formatForDiscord());
  }

  //Output mission descriptions and prepared button rows
  static presentMissionList(missions) {
    return {
      description:
        "📜 Hier sind die aktuellen Missionen:\n" +
        this.formatList(missions).join("\n"),
      rows: this.buildRows(missions),
    };
  }
}

export default MissionPresenter;
