import { ButtonBuilder, ButtonStyle } from "discord.js";

class MissionClass {
  constructor({
    _id,
    title,
    duration,
    description,
    difficulty,
    challenge,
    message,
    cost,
    xp,
  }) {
    this._id = _id || null;
    this.title = title;
    this.duration = duration;
    this.description = description;
    this.difficulty = difficulty;
    this.challenge = challenge;
    this.message = message;
    this.cost = cost;
    this.xp = xp;
  }

  toObject() {
    return { ...this };
  }

  rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  async callEvents(player, events, getItemFn) {
    let feedback = [];

    for (const event of events) {
      const dice = this.rollD20();
      let item = null;

      const isSuccess = dice + player.skills?.[event.type] >= event.difficulty;

      if (isSuccess) {
        //Get an item
        item = await getItemFn(event.type);
      }

      feedback.push({
        description: event.description,
        type: event.type,
        difficulty: event.difficulty,
        playerValue: player.skills[event.type],
        dice,
        total: dice + player.skills[event.type],
        isSuccess,
        item,
      });
    }

    return feedback;
  }

  checkSuccess(player) {
    if (!player || !this) return;
    const { challenge } = this;
    const feedback = { success: false, message: "" };
    const check = [
      "intelligence",
      "charisma",
      "strength",
      "dexterity",
      "perception",
    ];

    for (const att in challenge) {
      console.log(
        `Check ${att}: Player: ${player.skills[att]} | Challenge: ${challenge[att]}`
      );
      if (player.skills[att] < challenge[att]) {
        return {
          success: false,
          message: `${
            this.message[att] ?? "Check failed"
          } - ${att} check failed`,
        };
      }
    }

    return { success: true, message: this.message.success };
  }

  formatOutput() {
    return `**${this.title}**: ${this.description} (Dauer: ${this.duration} Minuten, Level: ${this.difficulty})`;
  }

  getButton() {
    return new ButtonBuilder()
      .setCustomId(`mission:${this._id.toString()}`)
      .setLabel(this.title)
      .setStyle(ButtonStyle.Primary);
  }
}

export default MissionClass;
