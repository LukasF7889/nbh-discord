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
class ItemClass {
    name = "undefined";
    type = "unknown";
    quantity = 1;
    constructor(data) {
        Object.assign(this, data); // fills all fields
    }
}
__decorate([
    prop({ required: true, unique: true }),
    __metadata("design:type", String)
], ItemClass.prototype, "name", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], ItemClass.prototype, "type", void 0);
__decorate([
    prop({ required: true, default: 1 }),
    __metadata("design:type", Number)
], ItemClass.prototype, "quantity", void 0);
export const ItemModel = getModelForClass(ItemClass, {
    schemaOptions: { collection: "items" },
});
export default ItemClass;
//# sourceMappingURL=ItemClass.js.map