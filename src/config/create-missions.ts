import mongoose from "mongoose";
import Mission from "../models/mission.js";
import dotenv from "dotenv";

dotenv.config();

async function createMissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Mission.deleteMany({});
    console.log("✅ Alle Missionen gelöscht");

    const missions = await Mission.create(
      {
        title: "Lagerüberfall",
        duration: "10",
        description: "Ein kleiner Lagerüberfall zur Übung.",
        difficulty: "Leicht",
        challenge: {
          intelligence: 8,
          charisma: 5,
          strength: 5,
          dexterity: 7,
          perception: 6,
        },
        message: {
          success: "Mission erfolgreich abgeschlossen!",
          intelligence: "Die Planung war zu schlampig",
          charisma: "Die Ablenkung hat nicht funktioniert",
          strength: "Du konntest das Tor nicht aufbrechen",
          dexterity: "Du bist ungeschickt gefallen",
          perception: "Du hast etwas Wichtiges übersehen",
        },
        cost: 10,
        xp: 50,
      },
      {
        title: "Wachdienst umgehen",
        duration: "15",
        description: "Schleiche an den Wachen vorbei.",
        difficulty: "Leicht",
        challenge: {
          intelligence: 10,
          charisma: 5,
          strength: 4,
          dexterity: 10,
          perception: 7,
        },
        message: {
          success: "Du hast die Wachen erfolgreich umgangen!",
          intelligence: "Dein Plan war zu einfach durchschaubar",
          dexterity: "Du bist über etwas gestolpert",
          perception: "Du hast die Wache übersehen",
        },
        cost: 15,
        xp: 75,
      },
      {
        title: "Zielperson verfolgen",
        duration: "20",
        description: "Folge der Zielperson unauffällig.",
        difficulty: "Leicht",
        challenge: {
          intelligence: 7,
          charisma: 6,
          strength: 4,
          dexterity: 8,
          perception: 10,
        },
        message: {
          success: "Ziel erfolgreich verfolgt!",
          perception: "Du hast den Kontakt verloren",
          dexterity: "Du wurdest fast entdeckt",
        },
        cost: 20,
        xp: 100,
      },
      {
        title: "Geheimbotschaft abfangen",
        duration: "25",
        description: "Fange eine geheime Botschaft ab.",
        difficulty: "Mittel",
        challenge: {
          intelligence: 14,
          charisma: 5,
          strength: 4,
          dexterity: 9,
          perception: 8,
        },
        message: {
          success: "Botschaft abgefangen!",
          intelligence: "Die Planung war fehlerhaft",
          dexterity: "Du hast den falschen Umschlag erwischt",
        },
        cost: 25,
        xp: 150,
      },
      {
        title: "Schatz sichern",
        duration: "30",
        description: "Sichere einen wertvollen Schatz.",
        difficulty: "Mittel",
        challenge: {
          intelligence: 9,
          charisma: 5,
          strength: 10,
          dexterity: 7,
          perception: 8,
        },
        message: {
          success: "Schatz erfolgreich gesichert!",
          strength: "Du konntest den Schatz nicht tragen",
          perception: "Du hast die Falle übersehen",
        },
        cost: 30,
        xp: 180,
      },
      {
        title: "Spionage in der Stadt",
        duration: "35",
        description: "Sammle Informationen in der Stadt.",
        difficulty: "Mittel",
        challenge: {
          intelligence: 12,
          charisma: 8,
          strength: 4,
          dexterity: 10,
          perception: 10,
        },
        message: {
          success: "Informationen gesammelt!",
          intelligence: "Du hast die Quelle falsch eingeschätzt",
          dexterity: "Du wurdest fast bemerkt",
        },
        cost: 35,
        xp: 200,
      },
      {
        title: "Sabotageaktion",
        duration: "40",
        description: "Sabotiere das feindliche Lager.",
        difficulty: "Schwer",
        challenge: {
          intelligence: 16,
          charisma: 5,
          strength: 12,
          dexterity: 12,
          perception: 10,
        },
        message: {
          success: "Sabotage erfolgreich!",
          intelligence: "Deine Pläne wurden durchschaut",
          strength: "Du konntest die Struktur nicht zerstören",
          dexterity: "Du bist beinahe entdeckt worden",
        },
        cost: 40,
        xp: 250,
      },
      {
        title: "Gefangene befreien",
        duration: "45",
        description: "Rette Gefangene aus einem feindlichen Lager.",
        difficulty: "Schwer",
        challenge: {
          intelligence: 14,
          charisma: 8,
          strength: 15,
          dexterity: 12,
          perception: 9,
        },
        message: {
          success: "Gefangene gerettet!",
          strength: "Du konntest das Tor nicht aufbrechen",
          dexterity: "Du wurdest fast entdeckt",
        },
        cost: 45,
        xp: 300,
      },
      {
        title: "Elitewachen besiegen",
        duration: "50",
        description: "Kämpfe gegen die Elitewachen.",
        difficulty: "Schwer",
        challenge: {
          intelligence: 10,
          charisma: 5,
          strength: 18,
          dexterity: 10,
          perception: 12,
        },
        message: {
          success: "Wachen besiegt!",
          strength: "Du wurdest überwältigt",
          dexterity: "Du konntest den Angriff nicht ausweichen",
        },
        cost: 50,
        xp: 350,
      },
      {
        title: "Geheime Festung erobern",
        duration: "60",
        description: "Erobere die geheime Festung des Feindes.",
        difficulty: "Schwer",
        challenge: {
          intelligence: 18,
          charisma: 8,
          strength: 16,
          dexterity: 14,
          perception: 14,
        },
        message: {
          success: "Festung erobert!",
          intelligence: "Du konntest den Plan nicht umsetzen",
          strength: "Die Verteidigung war zu stark",
          dexterity: "Du wurdest fast entdeckt",
        },
        cost: 60,
        xp: 400,
      }
    );

    console.log("✅ Missionen hinzugefügt");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

createMissions();
