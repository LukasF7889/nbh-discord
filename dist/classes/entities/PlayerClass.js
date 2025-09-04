import calcAttributeCost from "../../config/calcAttributeCost.js";
import { ticketMap } from "../../config/gameMaps.js";
import { calcLevelUp, energyForLevel } from "../../config/calcLevelup.js";
class PlayerClass {
    _id;
    discordId;
    username;
    xp;
    level;
    money;
    energy;
    mythos;
    type;
    skills;
    items;
    constructor(data) {
        this._id = data._id;
        this.discordId = data.discordId;
        this.username = data.username;
        this.xp = data.xp;
        this.level = data.level ?? 1;
        this.money = data.money ?? 0;
        this.energy = data.energy ?? { current: 100, max: 100 };
        this.mythos = data.mythos;
        this.type = data.type;
        this.skills = data.skills;
        this.items = data.items ?? [];
    }
    toObject() {
        return {
            ...this,
        };
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
    substractEnergy(amount) {
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
export default PlayerClass;
//# sourceMappingURL=PlayerClass.js.map