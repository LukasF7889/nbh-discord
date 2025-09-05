import mongoose from "mongoose";
import MissionClass from "../classes/entities/MissionClass.js";
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
//type guard to check if it is has the "toObject()"
function hasToObject(doc) {
    return typeof doc?.toObject === "function";
}
// shared helper: takes a plain object and returns MissionClass
function buildMissionClass(obj) {
    let id;
    if (obj._id != null)
        id = obj._id.toString();
    console.log("Converting id: ", id, obj._id);
    return new MissionClass({
        _id: id,
        title: obj.title ?? "Untitled",
        duration: obj.duration ?? 0,
        description: obj.description ?? "",
        difficulty: obj.difficulty ?? "Leicht",
        challenge: obj.challenge,
        message: obj.message,
        cost: obj.cost ?? 0,
        xp: obj.xp ?? 0,
    });
}
// for Mongoose Documents
export function docToMissionClass(doc) {
    if (!doc)
        return null;
    const obj = "toObject" in doc ? doc.toObject() : doc;
    return buildMissionClass(obj);
}
// for plain objects
export function objToMissionClass(obj) {
    if (!obj)
        return null;
    return buildMissionClass(obj);
}
//# sourceMappingURL=mission.js.map