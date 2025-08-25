import mongoose from "mongoose";
import Player from "../classes/entities/PlayerClass.js";

const playerSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: String,
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  energy: {
    max: { type: Number, required: true },
    current: { type: Number, required: true, default: 0 },
  },
  mythos: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "Geist",
      "Macht",
      "Schatten",
      "Glanz",
      "Wildnis",
      "Glaube",
      "Mysterium",
      "Ordnung",
      "Innovation",
      "Rebellion",
    ],
    default: "Geist",
  },
  skills: {
    intelligence: {
      type: Number,
      default: 0,
    },
    charisma: {
      type: Number,
      default: 0,
    },
    strength: {
      type: Number,
      default: 0,
    },
    dexterity: {
      type: Number,
      default: 0,
    },
    perception: {
      type: Number,
      default: 0,
    },
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  lastDailyReset: Date,
});

export default mongoose.model("Player", playerSchema);

// Converting mongoose document into a oop class
export function toPlayerClass(mongooseMissionDoc) {
  // .toObject() removes mongoose specific fields
  return new Player(mongooseMissionDoc.toObject());
}
