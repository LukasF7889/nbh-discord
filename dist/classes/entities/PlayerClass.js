var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import calcAttributeCost from "../../config/calcAttributeCost.js";
import { ticketMap } from "../../config/gameMaps.js";
import { calcLevelUp, energyForLevel } from "../../config/calcLevelup.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import ItemClass from "./ItemClass.js";
class Energy {
    current = 0;
    max = 100;
}
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Energy.prototype, "current", void 0);
__decorate([
    prop({ default: 100 }),
    __metadata("design:type", Number)
], Energy.prototype, "max", void 0);
class Skills {
    charisma = 0;
    strength = 0;
    intelligence = 0;
    dexterity = 0;
    perception = 0;
}
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Skills.prototype, "charisma", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Skills.prototype, "strength", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Skills.prototype, "intelligence", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Skills.prototype, "dexterity", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], Skills.prototype, "perception", void 0);
class PlayerClass {
    discordId = "";
    username = "Unknown";
    xp = 0;
    level = 1;
    money = 0;
    energy = new Energy();
    mythos = "Unknown";
    //setting allowMixed to 0 here to keep code DRY and ignore the typegoose warning
    type = "Geist";
    skills = new Skills();
    items;
    constructor(data) {
        Object.assign(this, data); // fills all fields
    }
    toPlainObject() {
        return {
            ...this,
        };
    }
    static hasToObject(doc) {
        return typeof doc?.toObject === "function";
    }
    // for Mongoose Documents
    static fromDoc(doc) {
        if (!doc)
            return null;
        const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
        return new PlayerClass({
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
            items: obj.items?.map((i) => new ItemClass(i)) ?? [],
        });
    }
    addItemToInventory(item) {
        //Validate item
        if (!item || !item.name)
            return;
        //Check if quantity is legit
        const quantity = typeof item.quantity === "number" && item.quantity > 0
            ? item.quantity
            : 1;
        //Check if item already in inventory
        const hasItem = this.items.find((i) => i.name === item.name);
        if (hasItem && hasItem.quantity >= 1) {
            hasItem.quantity += quantity;
            console.log("Increase quantity: ", hasItem.quantity, quantity);
        }
        else {
            this.items.push({
                name: item.name,
                type: item.type || "unknown",
                quantity: quantity,
            });
            console.log("Added new item: ", this.items);
        }
    }
    removeItemFromInventory(item, amount) {
        //Validate item
        if (!item || !item.name)
            throw new Error("Invalid item");
        //Validate amount
        if (amount < 1)
            throw new Error("Amount needs to be at least 1");
        //Check if item is in inventory
        const hasItem = this.items.find((i) => i.name === item.name);
        if (!hasItem)
            throw new Error("Item not in inventory");
        if (hasItem.quantity > amount) {
            hasItem.quantity -= amount;
        }
        else {
            const newInv = this.items.filter((i) => i.name !== hasItem.name);
            this.items = newInv;
        }
    }
    addXP(amount) {
        if (amount < 0)
            throw new Error("XP darf nicht negativ sein");
        this.xp += amount;
    }
    checkLevelup() {
        const reqXP = calcLevelUp(this.level + 1);
        return this.xp >= reqXP;
    }
    levelup() {
        if (this.checkLevelup()) {
            this.level += 1;
            this.increaseMaxEnergy();
        }
        else {
            throw new Error("Not enough XP to levelup");
        }
    }
    increaseMaxEnergy() {
        this.energy.max = energyForLevel(this.level);
    }
    addEnergy(amount) {
        if (amount < 0)
            throw new Error("Energie darf nicht negativ sein");
        if (this.energy.current + amount > this.energy.max) {
            this.energy.current = this.energy.max;
        }
        else {
            this.energy.current += amount;
        }
    }
    restoreEnergy() {
        this.energy.current = this.energy.max;
    }
    subtractEnergy(amount) {
        if (amount < 0)
            throw new Error("Energie darf nicht negativ sein");
        if (this.energy.current - amount < 0) {
            return { error: "Nicht genug Energie vorhanden" };
        }
        this.energy.current -= amount;
    }
    checkItemQuantity(itemName) {
        if (!itemName)
            return 0;
        const hasItem = this.items.find((e) => e.name === itemName);
        if (!hasItem || !hasItem.quantity)
            return 0;
        return hasItem.quantity;
    }
    checkAttributeUpgrade(att) {
        // Check if player is eligable to upgrade
        let invQuantity = this.checkItemQuantity(ticketMap[att]);
        if (!invQuantity)
            invQuantity = 0;
        const cost = calcAttributeCost(this.skills[att]);
        const isEligable = invQuantity >= cost;
        return { isEligable, invQuantity, cost };
    }
    async increaseAttribute(att) {
        if (!att)
            throw new Error("Fehler: Kein Attribut angegeben");
        //Upgrade attribute
        this.skills[att]++;
    }
}
__decorate([
    prop({ required: true, unique: true }),
    __metadata("design:type", String)
], PlayerClass.prototype, "discordId", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], PlayerClass.prototype, "username", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], PlayerClass.prototype, "xp", void 0);
__decorate([
    prop({ default: 1 }),
    __metadata("design:type", Number)
], PlayerClass.prototype, "level", void 0);
__decorate([
    prop({ default: 0 }),
    __metadata("design:type", Number)
], PlayerClass.prototype, "money", void 0);
__decorate([
    prop({ type: () => Energy, required: true, _id: false }),
    __metadata("design:type", Object)
], PlayerClass.prototype, "energy", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], PlayerClass.prototype, "mythos", void 0);
__decorate([
    prop({ required: true, allowMixed: 0 })
    //setting allowMixed to 0 here to keep code DRY and ignore the typegoose warning
    ,
    __metadata("design:type", Object)
], PlayerClass.prototype, "type", void 0);
__decorate([
    prop({ type: () => Skills, required: true, _id: false }),
    __metadata("design:type", Object)
], PlayerClass.prototype, "skills", void 0);
__decorate([
    prop({ type: () => [ItemClass], default: [] }),
    __metadata("design:type", Array)
], PlayerClass.prototype, "items", void 0);
export const PlayerModel = getModelForClass(PlayerClass, {
    schemaOptions: { collection: "players" },
});
export default PlayerClass;
//# sourceMappingURL=PlayerClass.js.map