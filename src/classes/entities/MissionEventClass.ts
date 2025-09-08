import mongoose from "mongoose";
import { getModelForClass, prop } from "@typegoose/typegoose";

class MissionEventClass {
  @prop({ required: true })
  description: String = "undefined";

  @prop({ required: true })
  type:
    | "intelligence"
    | "charisma"
    | "strength"
    | "dexterity"
    | "perception"
    | "unknown" = "unknown";

  @prop({ required: true })
  difficulty: number = 0;

  constructor(data?: Partial<MissionEventClass>) {
    Object.assign(this, data);
  }
}

export const MissionEventModel = getModelForClass(MissionEventClass);
export default MissionEventClass;
