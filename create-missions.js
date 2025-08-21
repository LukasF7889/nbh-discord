import mongoose from "mongoose";
import Mission from "./models/mission.js";
import dotenv from "dotenv";

dotenv.config();

async function createMissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Mission.deleteMany({});
    console.log("✅ Alle Missionen gelöscht");
    const missions = await Mission.create(
      {
        title: "Mission 1",
        duration: "10",
        description: "Einbruch in eine Villa",
        level: 1,
        challenge: {
          intelligence: 14,
          charisma: 9,
          strength: 4,
          dexterity: 9,
          perception: 9,
        },
        message: {
          success: "Einbruch abgeschlossen",
          intelligence: "Dein Plan war nicht gut genug",
          charisma: "Deine Verkleidung war nicht überzeugend genug",
          strength: "Du konntest das Schloss nicht aufbrechen",
          dexterity: "Du bist vom Dach gefallen",
          perception: "Du hast die Wachen übersehen",
        },
        cost: 10,
        xp: 100,
      },
      {
        title: "Mission 2",
        duration: "20",
        description: "Beschützen eines Convoys",
        level: 2,
        challenge: {
          intelligence: 14,
          charisma: 9,
          strength: 4,
          dexterity: 15,
          perception: 9,
        },
        message: {
          success: "Einbruch abgeschlossen",
          intelligence: "Dein Plan war nicht gut genug",
          charisma: "Deine Verkleidung war nicht überzeugend genug",
          strength: "Du konntest das Schloss nicht aufbrechen",
          dexterity: "Du bist vom Dach gefallen",
          perception: "Du hast die Wachen übersehen",
        },
        cost: 20,
        xp: 200,
      },
      {
        title: "Mission 30",
        duration: "3",
        description: "Erledigen einer Zielperson",
        level: 3,
        challenge: {
          intelligence: 20,
          charisma: 9,
          strength: 4,
          dexterity: 9,
          perception: 9,
        },
        message: {
          success: "Einbruch abgeschlossen",
          intelligence: "Dein Plan war nicht gut genug",
          charisma: "Deine Verkleidung war nicht überzeugend genug",
          strength: "Du konntest das Schloss nicht aufbrechen",
          dexterity: "Du bist vom Dach gefallen",
          perception: "Du hast die Wachen übersehen",
        },
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
