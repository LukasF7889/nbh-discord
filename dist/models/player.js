import mongoose from "mongoose";
import PlayerClass from "../classes/entities/PlayerClass.js";
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
            type: {
                type: String,
                required: true,
            },
        },
    ],
    lastDailyReset: Date,
});
export default mongoose.model("Player", playerSchema);
//type guard to check if it is has the "toObject()"
function hasToObject(doc) {
    return typeof doc?.toObject === "function";
}
// Converting mongoose document into a oop class
export function toPlayerClass(doc) {
    if (!doc)
        return null;
    const obj = hasToObject(doc)
        ? doc.toObject()
        : doc;
    const data = {
        // _id: obj._id ?? "unknown_id",
        discordId: obj.discordId,
        username: obj.username ?? "Unknown",
        level: obj.level ?? 1,
        xp: obj.xp ?? 0,
        money: obj.money ?? 0,
        energy: obj.energy ?? { current: 0, max: 100 },
        mythos: obj.mythos ?? "Unknown",
        type: obj.type ?? "Geist",
        skills: obj.skills ?? {
            intelligence: 0,
            charisma: 0,
            strength: 0,
            dexterity: 0,
            perception: 0,
        },
        items: obj.items ?? [],
    };
    return new PlayerClass(data);
}
//# sourceMappingURL=player.js.map