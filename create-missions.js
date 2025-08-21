import mongoose from "mongoose";
import Mission from "./models/mission.js";
import dotenv from "dotenv";

dotenv.config();

async function createMissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const missions = await Mission.create(
      {
        title: "Mission 1",
        duration: "1",
        description: "Einbruch in eine Villa",
        difficulty: "Easy",
        cost: 10,
        xp: 100,
      },
      {
        title: "Mission 2",
        duration: "2",
        description: "Beschützen eines Convoys",
        difficulty: "Medium",
        cost: 20,
        xp: 200,
      },
      {
        title: "Mission 3",
        duration: "3",
        description: "Erledigen einer Zielperson",
        difficulty: "Hard",
        cost: 30,
        xp: 300,
      }
    );

    console.log("✅ Missionen hinzugefügt");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

createMissions();
