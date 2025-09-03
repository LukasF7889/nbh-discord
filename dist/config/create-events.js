import mongoose from "mongoose";
import MissionEvent from "../models/missionEvents.js";
import dotenv from "dotenv";
dotenv.config();
const createEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await MissionEvent.create([
            // --- Charisma (10) ---
            {
                description: "Überzeuge einen Wachmann",
                type: "charisma",
                difficulty: 15,
            },
            {
                description: "Beschwichtige eine Straßengang",
                type: "charisma",
                difficulty: 22,
            },
            {
                description: "Lüge dich durch eine Polizeikontrolle",
                type: "charisma",
                difficulty: 18,
            },
            {
                description: "Überrede eine Informantin",
                type: "charisma",
                difficulty: 25,
            },
            {
                description: "Begeistere einen Investor",
                type: "charisma",
                difficulty: 28,
            },
            {
                description: "Schüchtere einen Dealer ein",
                type: "charisma",
                difficulty: 20,
            },
            {
                description: "Halte eine flammende Rede in einer Bar",
                type: "charisma",
                difficulty: 30,
            },
            {
                description: "Charmiere einen Türsteher",
                type: "charisma",
                difficulty: 14,
            },
            {
                description: "Täusche Selbstbewusstsein vor",
                type: "charisma",
                difficulty: 26,
            },
            {
                description: "Überzeuge eine Gang zum Waffenstillstand",
                type: "charisma",
                difficulty: 35,
            },
            // --- Intelligence (10) ---
            {
                description: "Analysiere einen Gebäudeplan",
                type: "intelligence",
                difficulty: 15,
            },
            {
                description: "Entschlüssle ein altes Tagebuch",
                type: "intelligence",
                difficulty: 15,
            },
            {
                description: "Knacke einen Sicherheitscode",
                type: "intelligence",
                difficulty: 22,
            },
            {
                description: "Rekonstruiere einen Unfall",
                type: "intelligence",
                difficulty: 18,
            },
            {
                description: "Finde eine Vertragslücke",
                type: "intelligence",
                difficulty: 28,
            },
            {
                description: "Entwirre eine Zahlenreihe",
                type: "intelligence",
                difficulty: 20,
            },
            {
                description: "Analysiere eine Blutspur",
                type: "intelligence",
                difficulty: 25,
            },
            {
                description: "Baue ein Funkgerät aus Schrott",
                type: "intelligence",
                difficulty: 30,
            },
            {
                description: "Erinnere dich an ein Märchen",
                type: "intelligence",
                difficulty: 14,
            },
            {
                description: "Erkenne ein Muster in Vermisstenfällen",
                type: "intelligence",
                difficulty: 26,
            },
            // --- Strength (10) ---
            {
                description: "Klettere auf ein Dach",
                type: "strength",
                difficulty: 15,
            },
            { description: "Stoße eine Tür auf", type: "strength", difficulty: 18 },
            {
                description: "Halte ein heranrasendes Auto auf",
                type: "strength",
                difficulty: 35,
            },
            {
                description: "Schleppe eine verletzte Person",
                type: "strength",
                difficulty: 20,
            },
            {
                description: "Zerschlage ein Schloss",
                type: "strength",
                difficulty: 25,
            },
            {
                description: "Reiße ein Gitter aus der Wand",
                type: "strength",
                difficulty: 30,
            },
            {
                description: "Drücke einen Gegner nieder",
                type: "strength",
                difficulty: 28,
            },
            { description: "Hebel eine Luke auf", type: "strength", difficulty: 16 },
            {
                description: "Rette dich aus einem Griff",
                type: "strength",
                difficulty: 22,
            },
            {
                description: "Halte eine Barrikade gegen Angreifer",
                type: "strength",
                difficulty: 32,
            },
            // --- Dexterity (10) ---
            { description: "Knacke ein Schloss", type: "dexterity", difficulty: 15 },
            {
                description: "Balanciere über ein Gerüst",
                type: "dexterity",
                difficulty: 18,
            },
            {
                description: "Schleiche an einer Kamera vorbei",
                type: "dexterity",
                difficulty: 20,
            },
            {
                description: "Entwaffne eine Falle",
                type: "dexterity",
                difficulty: 28,
            },
            {
                description: "Springe von Dach zu Dach",
                type: "dexterity",
                difficulty: 25,
            },
            {
                description: "Fange ein fallendes Artefakt",
                type: "dexterity",
                difficulty: 22,
            },
            {
                description: "Ziehe dich durch ein Fenster",
                type: "dexterity",
                difficulty: 14,
            },
            {
                description: "Weiche einem Messerangriff aus",
                type: "dexterity",
                difficulty: 30,
            },
            {
                description: "Lenke eine Drohne ab",
                type: "dexterity",
                difficulty: 26,
            },
            {
                description: "Hangle dich über eine Schlucht",
                type: "dexterity",
                difficulty: 34,
            },
            // --- Perception (10) ---
            {
                description: "Beobachte die Überwachungskameras",
                type: "perception",
                difficulty: 15,
            },
            {
                description: "Entdecke eine versteckte Tür",
                type: "perception",
                difficulty: 18,
            },
            {
                description: "Lausche einem Gespräch im Hinterzimmer",
                type: "perception",
                difficulty: 22,
            },
            {
                description: "Erkenne eine Verkleidung",
                type: "perception",
                difficulty: 25,
            },
            {
                description: "Bemerk ein ungewöhnliches Flackern im Nebel",
                type: "perception",
                difficulty: 28,
            },
            {
                description: "Spüre ein Flüstern im Wind",
                type: "perception",
                difficulty: 30,
            },
            {
                description: "Sieh einen Schatten auf dem Dach",
                type: "perception",
                difficulty: 20,
            },
            {
                description: "Entdecke einen falschen Ausweis",
                type: "perception",
                difficulty: 26,
            },
            {
                description: "Merke eine Kameralinse im Regen",
                type: "perception",
                difficulty: 32,
            },
            {
                description: "Erkenne eine Illusion im Spiegelbild",
                type: "perception",
                difficulty: 35,
            },
        ]);
        console.log("Events created:", events.length);
        mongoose.connection.close();
    }
    catch (error) {
        console.error(error);
    }
};
createEvents();
//# sourceMappingURL=create-events.js.map