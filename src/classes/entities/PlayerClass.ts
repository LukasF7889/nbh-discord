import calcAttributeCost from "../../config/calcAttributeCost.js";
import { ticketMap } from "../../config/gameMaps.js";
import { calcLevelUp, energyForLevel } from "../../config/calcLevelup.js";
import { mythTypes } from "../../config/mythTypes.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import ItemClass from "./ItemClass.js";
import mongoose from "mongoose";

class PlayerClass {
  @prop({ required: true, unique: true })
  discordId: string = "";

  @prop({ required: true })
  username: string = "Unknown";

  @prop({ default: 0 })
  xp: number = 0;

  @prop({ default: 1 })
  level: number = 1;

  @prop({ default: 0 })
  money: number = 0;

  @prop({ default: { current: 0, max: 100 } })
  energy = { current: 0, max: 100 };

  @prop({ required: true })
  mythos: string = "Unknown";

  @prop({ required: true })
  type: keyof typeof mythTypes = "Geist";

  @prop({
    default: {
      charisma: 0,
      strength: 0,
      intelligence: 0,
      dexterity: 0,
      perception: 0,
    },
  })
  skills: {
    charisma: number;
    strength: number;
    intelligence: number;
    dexterity: number;
    perception: number;
  } = {
    charisma: 0,
    strength: 0,
    intelligence: 0,
    dexterity: 0,
    perception: 0,
  };

  @prop({ type: () => [ItemClass], default: [] })
  items!: ItemClass[];

  constructor(data?: Partial<PlayerClass>) {
    Object.assign(this, data); // fills all fields
  }

  toObject() {
    return {
      ...this,
    };
  }

  static hasToObject(
    doc: any
  ): doc is mongoose.Document & { toObject: () => PlayerClass } {
    return typeof doc?.toObject === "function";
  }

  // for Mongoose Documents
  static fromDoc(doc: mongoose.Document | null): PlayerClass | null {
    if (!doc) return null;
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
      items: obj.items?.map((i: any) => new ItemClass(i)) ?? [],
    });
  }

  addItemToInventory(item: ItemClass) {
    //Validate item
    if (!item || !item.name) return;

    //Check if quantity is legit
    const quantity =
      typeof item.quantity === "number" && item.quantity > 0
        ? item.quantity
        : 1;

    //Check if item already in inventory
    const hasItem = this.items.find((i) => i.name === item.name);

    if (hasItem && hasItem.quantity >= 1) {
      hasItem.quantity += quantity;
      console.log("Increase quantity: ", hasItem.quantity, quantity);
    } else {
      this.items.push({
        name: item.name,
        type: item.type || "unknown",
        quantity: quantity,
        properties: item.properties || {},
      });
      console.log("Added new item: ", this.items);
    }
  }

  removeItemFromInventory(item: ItemClass, amount: number) {
    //Validate item
    if (!item || !item.name) throw new Error("Invalid item");

    //Validate amount
    if (amount < 1) throw new Error("Amount needs to be at least 1");

    //Check if item is in inventory
    const hasItem = this.items.find((i) => i.name === item.name);
    if (!hasItem) throw new Error("Item not in inventory");
    if (hasItem.quantity > amount) {
      hasItem.quantity -= amount;
    } else {
      const newInv = this.items.filter((i) => i.name !== hasItem.name);
      this.items = newInv;
    }
  }

  addXP(amount: number) {
    if (amount < 0) throw new Error("XP darf nicht negativ sein");
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
    } else {
      throw new Error("Not enough XP to levelup");
    }
  }

  increaseMaxEnergy() {
    this.energy.max = energyForLevel(this.level);
  }

  addEnergy(amount: number) {
    if (amount < 0) throw new Error("Energie darf nicht negativ sein");
    if (this.energy.current + amount > this.energy.max) {
      this.energy.current = this.energy.max;
    } else {
      this.energy.current += amount;
    }
  }

  restoreEnergy() {
    this.energy.current = this.energy.max;
  }

  subtractEnergy(amount: number) {
    if (amount < 0) throw new Error("Energie darf nicht negativ sein");
    if (this.energy.current - amount < 0) {
      return { error: "Nicht genug Energie vorhanden" };
    }
    this.energy.current -= amount;
  }

  checkItemQuantity(itemName: string) {
    if (!itemName) return 0;
    const hasItem = this.items.find((e) => e.name === itemName);
    if (!hasItem || !hasItem.quantity) return 0;
    return hasItem.quantity;
  }

  checkAttributeUpgrade(att: keyof PlayerClass["skills"]) {
    // Check if player is eligable to upgrade
    let invQuantity = this.checkItemQuantity(ticketMap[att]);
    if (!invQuantity) invQuantity = 0;
    const cost = calcAttributeCost(this.skills[att]);
    const isEligable = invQuantity >= cost;
    return { isEligable, invQuantity, cost };
  }

  async increaseAttribute(att: keyof PlayerClass["skills"]) {
    if (!att) throw new Error("Fehler: Kein Attribut angegeben");

    //Upgrade attribute
    this.skills[att]++;
  }
}

export const PlayerModel = getModelForClass(PlayerClass);
export default PlayerClass;
