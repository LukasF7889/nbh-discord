import mongoose from "mongoose";
import MissionClass from "../classes/entities/MissionClass.js";
export const missionSchema = new mongoose.Schema({
    _id: String,
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
// Converting mongoose document into a oop class
export function toMissionClass(doc) {
    if (!doc)
        return null;
    const obj = hasToObject(doc)
        ? doc.toObject()
        : doc;
    //Setting defaults, because mongoDB fields in documents are not guaranteed to exist
    return new MissionClass({
        _id: obj._id ?? "unknown_id",
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
//# sourceMappingURL=mission.js.map