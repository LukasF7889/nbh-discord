var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import MissionClass from "./MissionClass.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
class BlackboardClass {
    currentMissions = [];
    lastUpdated = new Date();
    key = "main";
    refreshTime = 300000;
    constructor(data) {
        Object.assign(this, data); // fills all fields
    }
    toObject() {
        return {
            ...this,
            currentMissions: this.currentMissions.map((m) => m.toObject()), // zurück in plain objects
        };
    }
    needsUpdate() {
        if (!this.lastUpdated)
            return true;
        const needsUpdate = Date.now() - new Date(this.lastUpdated).getTime() > this.refreshTime;
        return needsUpdate;
    }
    updateMissions(newMissions) {
        this.currentMissions = newMissions;
        this.lastUpdated = new Date();
    }
    getRefreshTime() {
        if (!this.lastUpdated)
            return this.refreshTime / 1000 / 60;
        const elapsed = Date.now() - new Date(this.lastUpdated).getTime();
        const remaining = this.refreshTime - elapsed;
        return Math.max(0, remaining / 1000 / 60);
    }
    static fromDoc(doc) {
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
}
__decorate([
    prop({ type: () => [MissionClass], required: true }),
    __metadata("design:type", Array)
], BlackboardClass.prototype, "currentMissions", void 0);
__decorate([
    prop({ default: () => new Date() }),
    __metadata("design:type", Object)
], BlackboardClass.prototype, "lastUpdated", void 0);
__decorate([
    prop(),
    __metadata("design:type", String)
], BlackboardClass.prototype, "key", void 0);
__decorate([
    prop(),
    __metadata("design:type", Number)
], BlackboardClass.prototype, "refreshTime", void 0);
export const BlackboardModel = getModelForClass(BlackboardClass);
export default BlackboardClass;
//# sourceMappingURL=BlackboardClass.js.map