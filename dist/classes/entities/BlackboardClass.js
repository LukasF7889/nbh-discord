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
    static toBlackboardClass(doc) {
        if (!doc)
            return null;
        const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
        //check if lastUpdated ist a date object
        obj.lastUpdated = obj.lastUpdated ? new Date(obj.lastUpdated) : null;
        // map currentMissions into MissionClass objects
        obj.currentMissions = obj.currentMissions.map((m) => new MissionClass(m));
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