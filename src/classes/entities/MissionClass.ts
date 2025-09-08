import { ButtonBuilder, ButtonStyle } from "discord.js";
import PlayerClass from "./PlayerClass.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import MissionEventClass from "./MissionEventClass.js";

class MissionClass {
  @prop()
  _id?: string;

  @prop({ required: true })
  title: string = "unknown";

  @prop({ required: true })
  duration: number = 0;

  @prop({ required: true })
  description: string = "unknown";

  @prop({ required: true })
  difficulty: string = "Easy";

  @prop({ required: true })
  challenge: Record<keyof PlayerClass["skills"], number> = {
    charisma: 1,
    strength: 1,
    perception: 1,
    intelligence: 1,
    dexterity: 1,
  };

  @prop({ required: true })
  message: Record<string, string> = { message: "unknown message" };

  @prop({ required: true })
  cost: number = 1;

  @prop({ required: true })
  xp: number = 1;

  constructor(data?: Partial<MissionClass>) {
    Object.assign(this, data); // fills all fields
  }

  toObject() {
    return { ...this };
  }

  rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  async callEvents(
    player: PlayerClass,
    events: MissionEventClass[],
    getItemFn: (Parameters: string) => Promise<any>
  ) {
    let feedback = [];

    for (const event of events) {
      const dice = this.rollD20();
      let item = null;

      if (event.type === "unknown")
        throw new Error("Unknown event was triggered");
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

  checkSuccess(player: PlayerClass) {
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

    for (const attStr in challenge) {
      const att = attStr as keyof PlayerClass["skills"];
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
    if (!this._id) {
      throw new Error("Mission ID fehlt!");
    }

    return new ButtonBuilder()
      .setCustomId(`mission:${this._id.toString()}`)
      .setLabel(this.title)
      .setStyle(ButtonStyle.Primary);
  }

  //type guard to check if it is has the "toObject()"
  hasToObject(
    doc: any
  ): doc is mongoose.Document & { toObject: () => MissionClass } {
    return typeof doc?.toObject === "function";
  }

  // shared helper: takes a plain object and returns MissionClass
  static buildMissionClass(
    obj: Partial<MissionClass> & { _id?: any }
  ): MissionClass {
    let id: string | undefined;
    if (obj._id != null) id = obj._id.toString();
    console.log("Converting id: ", id, obj._id);
    return new MissionClass({
      _id: id,
      title: obj.title ?? "Untitled",
      duration: obj.duration ?? 0,
      description: obj.description ?? "",
      difficulty: obj.difficulty ?? "Leicht",
      challenge: obj.challenge ?? {
        charisma: 1,
        strength: 1,
        perception: 1,
        intelligence: 1,
        dexterity: 1,
      },
      message: obj.message ?? { message: "unknown message" },
      cost: obj.cost ?? 0,
      xp: obj.xp ?? 0,
    });
  }

  // for Mongoose Documents
  static fromDoc(doc: mongoose.Document | null): MissionClass | null {
    if (!doc) return null;
    return this.buildMissionClass(doc.toObject());
  }

  // for plain objects
  static fromObj(
    obj: (Partial<MissionClass> & { _id?: any }) | null
  ): MissionClass | null {
    if (!obj) return null;
    return this.buildMissionClass(obj);
  }
}

export const MissionModel = getModelForClass(MissionClass);
export default MissionClass;
