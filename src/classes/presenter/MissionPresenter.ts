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
    return missionList.map((m) => m.formatOutput());
  }

  //Output mission descriptions and prepared button rows
  static presentMissionList(missions, blackboard) {
    return {
      description:
        `📜 Hier sind die aktuellen Missionen (Neue Missionen verfügbar in ${blackboard
          .getRefreshTime()
          .toFixed(1)} Minuten):\n` + this.formatList(missions).join("\n"),
      rows: this.buildRows(missions).map((r) => r.toJSON()),
    };
  }
}

export default MissionPresenter;
