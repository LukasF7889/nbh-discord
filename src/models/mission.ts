import mongoose, { InferSchemaType } from "mongoose";
import { Document } from "mongodb";
import Mission from "../classes/entities/MissionClass.js";
import MissionClass from "../classes/entities/MissionClass.js";
import PlayerClass from "../classes/entities/PlayerClass.js";

export const missionSchema = new mongoose.Schema({
  _id: String,
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

// Converting mongoose document into a oop class
export function toMissionClass(
  doc: mongoose.Document | MissionDocument | null
): MissionClass | null {
  if (!doc) return null;

  const obj: MissionDocument = hasToObject(doc)
    ? doc.toObject()
    : (doc as MissionDocument);

  //Setting defaults, because mongoDB fields in documents are not guaranteed to exist
  return new MissionClass({
    _id: obj._id ?? "unknown_id",
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
