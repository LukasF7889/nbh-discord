import mongoose from "mongoose";

export const missionSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  description: String,
  level: Number,
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
