import mongoose from "mongoose";

export const missionSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  description: String,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Super-Hard"] },
  cost: Number,
  xp: Number,
});

export default mongoose.model("Mission", missionSchema);
