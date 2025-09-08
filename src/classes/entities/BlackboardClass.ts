import MissionClass from "./MissionClass.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Document } from "mongodb";

interface BlackboardConstructorData {
  currentMissions: MissionClass[];
  lastUpdated?: Date | null;
  key: string;
  refreshTime: number;
}

class BlackboardClass {
  @prop({ type: () => [MissionClass], required: true })
  currentMissions: MissionClass[] = [];

  @prop({ default: () => new Date() })
  lastUpdated: Date | null = new Date();

  @prop()
  key: string = "main";

  @prop()
  refreshTime: number = 300000;

  constructor(data?: Partial<BlackboardClass>) {
    Object.assign(this, data); // fills all fields
  }

  toObject() {
    return {
      ...this,
      currentMissions: this.currentMissions.map((m) => m.toObject()), // zurück in plain objects
    };
  }

  needsUpdate() {
    if (!this.lastUpdated) return true;
    const needsUpdate =
      Date.now() - new Date(this.lastUpdated).getTime() > this.refreshTime;
    return needsUpdate;
  }

  updateMissions(newMissions: MissionClass[]) {
    this.currentMissions = newMissions;
    this.lastUpdated = new Date();
  }

  getRefreshTime() {
    if (!this.lastUpdated) return this.refreshTime / 1000 / 60;
    const elapsed = Date.now() - new Date(this.lastUpdated).getTime();
    const remaining = this.refreshTime - elapsed;
    return Math.max(0, remaining / 1000 / 60);
  }

  static fromDoc(
    doc: PlayerDocument | mongoose.Document | null
  ): PlayerClass | null {
    if (!doc) return null;

    const obj: PlayerDocument = hasToObject(doc)
      ? doc.toObject()
      : (doc as PlayerDocument);

    const data: PlayerType = {
      // _id: obj._id ?? "unknown_id",
      discordId: obj.discordId,
      username: obj.username ?? "Unknown",
      level: obj.level ?? 1,
      xp: obj.xp ?? 0,
      money: obj.money ?? 0,
      energy: obj.energy ?? { current: 0, max: 100 },
      mythos: obj.mythos ?? "Unknown",
      type: obj.type ?? "Geist",
      skills: obj.skills ?? {
        intelligence: 0,
        charisma: 0,
        strength: 0,
        dexterity: 0,
        perception: 0,
      },
      items: obj.items ?? [],
    };

    return new PlayerClass(data);
  }
}

export const BlackboardModel = getModelForClass(BlackboardClass);
export default BlackboardClass;
