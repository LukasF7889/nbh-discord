import mongoose, { InferSchemaType } from "mongoose";
import Mission from "../classes/entities/MissionClass.js";
import MissionClass from "../classes/entities/MissionClass.js";
import PlayerClass from "../classes/entities/PlayerClass.js";
import { Document } from "mongodb";

export const missionSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  description: String,
  difficulty: {
    type: String,
    enum: [
      "Leicht",
      "Mittel",
      "Schwer",
      "Super Schwer",
      "Profi",
      "Elite",
      "Legendär",
      "Mythisch",
      "Apokalyptisch",
    ],
  },
  challenge: {
    intelligence: { type: Number, required: true },
    charisma: { type: Number, required: true },
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    perception: { type: Number, required: true },
  },
  message: {
    success: { type: String, required: true },
    intelligence: { type: String, required: false },
    charisma: { type: String, required: false },
    strength: { type: String, required: false },
    dexterity: { type: String, required: false },
    perception: { type: String, required: false },
  },
  cost: Number,
  xp: Number,
});

export type MissionDocument = InferSchemaType<typeof missionSchema>;
export default mongoose.model("Mission", missionSchema);

//type guard to check if it is has the "toObject()"
function hasToObject(
  doc: any
): doc is mongoose.Document & { toObject: () => MissionDocument } {
  return typeof doc?.toObject === "function";
}

// shared helper: takes a plain object and returns MissionClass
function buildMissionClass(
  obj: Partial<MissionDocument> & { _id?: any }
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
    challenge: obj.challenge as Record<keyof PlayerClass["skills"], number>,
    message: obj.message as Record<string, string>,
    cost: obj.cost ?? 0,
    xp: obj.xp ?? 0,
  });
}

// for Mongoose Documents
export function docToMissionClass(
  doc: mongoose.Document | null
): MissionClass | null {
  if (!doc) return null;

  const obj = "toObject" in doc ? doc.toObject() : doc;

  return buildMissionClass(obj);
}

// for plain objects
export function objToMissionClass(
  obj: (Partial<MissionDocument> & { _id?: any }) | null
): MissionClass | null {
  if (!obj) return null;

  return buildMissionClass(obj);
}
