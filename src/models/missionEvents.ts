import mongoose from "mongoose";

const missionEventSchema = new mongoose.Schema({
  description: String,
  type: {
    type: String,
    enum: ["intelligence", "charisma", "strength", "dexterity", "perception"],
  },
  difficulty: Number,
});

export default mongoose.model("MissionEvent", missionEventSchema);
