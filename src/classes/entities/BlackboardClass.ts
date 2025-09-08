import MissionClass from "./MissionClass.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Document } from "mongodb";

class BlackboardClass {
  @prop({ type: () => [MissionClass], required: true })
  currentMissions: MissionClass[] = [];

  @prop({ type: () => Date, default: () => new Date() })
  lastUpdated: Date | null = new Date();

  @prop()
  key: string = "main";

  @prop()
  refreshTime: number = 300000;

  constructor(data?: Partial<BlackboardClass>) {
    Object.assign(this, data); // fills all fields
  }

  toPlainObject() {
    return {
      ...this,
      currentMissions: this.currentMissions.map((m) => m.toPlainObject()), // zurück in plain objects
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

  static fromDoc(doc: Document | null): BlackboardClass | null {
    if (!doc) return null;

    const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;

    // Ensure lastUpdated is a Date object
    obj.lastUpdated = obj.lastUpdated ? new Date(obj.lastUpdated) : null;

    // Map currentMissions into MissionClass objects
    obj.currentMissions = obj.currentMissions.map(
      (m: any) => new MissionClass(m)
    );

    return new BlackboardClass(obj);
  }
}

export const BlackboardModel = getModelForClass(BlackboardClass, {
  schemaOptions: { collection: "blackboards" },
});
export default BlackboardClass;
