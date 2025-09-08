var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
class Challenge {
    charisma;
    strength;
    perception;
    intelligence;
    dexterity;
}
__decorate([
    prop(),
    __metadata("design:type", Number)
], Challenge.prototype, "charisma", void 0);
__decorate([
    prop(),
    __metadata("design:type", Number)
], Challenge.prototype, "strength", void 0);
__decorate([
    prop(),
    __metadata("design:type", Number)
], Challenge.prototype, "perception", void 0);
__decorate([
    prop(),
    __metadata("design:type", Number)
], Challenge.prototype, "intelligence", void 0);
__decorate([
    prop(),
    __metadata("design:type", Number)
], Challenge.prototype, "dexterity", void 0);
class Message {
    success;
    intelligence;
    charisma;
    strength;
    dexterity;
    perception;
}
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "success", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "intelligence", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "charisma", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "strength", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "dexterity", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], Message.prototype, "perception", void 0);
class MissionClass {
    _id;
    title = "unknown";
    duration = 0;
    description = "unknown";
    difficulty = "Easy";
    challenge = {
        charisma: 1,
        strength: 1,
        perception: 1,
        intelligence: 1,
        dexterity: 1,
    };
    message = { success: "unknown message" };
    cost = 1;
    xp = 1;
    constructor(data) {
        Object.assign(this, data); // fills all fields
    }
    toPlainObject() {
        return { ...this };
    }
    rollD20() {
        return Math.floor(Math.random() * 20) + 1;
    }
    async callEvents(player, events, getItemFn) {
        let feedback = [];
        for (const event of events) {
            const dice = this.rollD20();
            let item = null;
            if (event.type === "unknown")
                throw new Error("Unknown event was triggered");
            const isSuccess = dice + player.skills?.[event.type] >= event.difficulty;
            if (isSuccess) {
                //Get an item
                item = await getItemFn(event.type);
            }
            feedback.push({
                description: event.description,
                type: event.type,
                difficulty: event.difficulty,
                playerValue: player.skills[event.type],
                dice,
                total: dice + player.skills[event.type],
                isSuccess,
                item,
            });
        }
        return feedback;
    }
    checkSuccess(player) {
        if (!player || !this)
            return;
        const { challenge } = this;
        const feedback = { success: false, message: "" };
        const check = [
            "intelligence",
            "charisma",
            "strength",
            "dexterity",
            "perception",
        ];
        for (const attStr in challenge) {
            const att = attStr;
            console.log(`Check ${att}: Player: ${player.skills[att]} | Challenge: ${challenge[att]}`);
            if (player.skills[att] < challenge[att]) {
                return {
                    success: false,
                    message: `${this.message[att] ?? "Check failed"} - ${att} check failed`,
                };
            }
        }
        return { success: true, message: this.message.success };
    }
    formatOutput() {
        return `**${this.title}**: ${this.description} (Dauer: ${this.duration} Minuten, Level: ${this.difficulty})`;
    }
    getButton() {
        if (!this._id) {
            throw new Error("Mission ID fehlt!");
        }
        return new ButtonBuilder()
            .setCustomId(`mission:${this._id.toString()}`)
            .setLabel(this.title)
            .setStyle(ButtonStyle.Primary);
    }
    //type guard to check if it is has the "toObject()"
    hasToObject(doc) {
        return typeof doc?.toObject === "function";
    }
    // shared helper: takes a plain object and returns MissionClass
    static buildMissionClass(obj) {
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
            challenge: obj.challenge ?? {
                charisma: 1,
                strength: 1,
                perception: 1,
                intelligence: 1,
                dexterity: 1,
            },
            message: obj.message ?? { success: "unknown message" },
            cost: obj.cost ?? 0,
            xp: obj.xp ?? 0,
        });
    }
    // for Mongoose Documents
    static fromDoc(doc) {
        if (!doc)
            return null;
        return this.buildMissionClass(doc.toObject());
    }
    // for plain objects
    static fromObj(obj) {
        if (!obj)
            return null;
        return this.buildMissionClass(obj);
    }
}
__decorate([
    prop({ type: mongoose.Types.ObjectId }),
    __metadata("design:type", Object)
], MissionClass.prototype, "_id", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], MissionClass.prototype, "title", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", Number)
], MissionClass.prototype, "duration", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], MissionClass.prototype, "description", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], MissionClass.prototype, "difficulty", void 0);
__decorate([
    prop({ type: () => Challenge, required: true, _id: false }),
    __metadata("design:type", Object)
], MissionClass.prototype, "challenge", void 0);
__decorate([
    prop({ type: () => Message, required: true, _id: false }),
    __metadata("design:type", Object)
], MissionClass.prototype, "message", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", Number)
], MissionClass.prototype, "cost", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", Number)
], MissionClass.prototype, "xp", void 0);
export const MissionModel = getModelForClass(MissionClass, {
    schemaOptions: { collection: "missions" },
});
export default MissionClass;
//# sourceMappingURL=MissionClass.js.map