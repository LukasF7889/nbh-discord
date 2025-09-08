var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getModelForClass, prop } from "@typegoose/typegoose";
class MissionEventClass {
    description = "undefined";
    type = "unknown";
    difficulty = 0;
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], MissionEventClass.prototype, "description", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], MissionEventClass.prototype, "type", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", Number)
], MissionEventClass.prototype, "difficulty", void 0);
export const MissionEventModel = getModelForClass(MissionEventClass, {
    schemaOptions: { collection: "missionevents" },
});
export default MissionEventClass;
//# sourceMappingURL=MissionEventClass.js.map