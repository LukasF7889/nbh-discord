import mongoose from "mongoose";

// Importiere die OOP-Klasse
import Mission from "../classes/entities/MissionClass.js";
import MissionRepository from "../classes/repositories/MissionRepository.js";

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

export default mongoose.model("Mission", missionSchema);

// Converting mongoose document into a oop class
export function toMissionClass(mongooseMissionDoc) {
  // .toObject() removes mongoose specific fields
  return new Mission(mongooseMissionDoc.toObject());
}
