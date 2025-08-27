class PlayerClass {
  constructor({
    _id,
    discordId,
    username,
    level,
    xp,
    money,
    energy = {},
    mythos,
    type,
    skills,
    items,
  }) {
    this._id = _id;
    this.discordId = discordId;
    this.username = username;
    this.level = level;
    this.xp = xp;
    this.money = money;
    this.energy = energy;
    this.mythos = mythos;
    this.type = type;
    this.skills = skills;
    this.items = items;
  }

  toObject() {
    return {
      ...this,
    };
  }

  async addItemToInventory(item) {
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
        properties: item.properties || {},
        quantity: quantity,
      });
      console.log("Added new item: ", this.items);
    }
  }

  addXP(amount) {
    if (amount < 0) throw new Error("XP darf nicht negativ sein");
    this.xp += amount;
  }

  addEnergy(amount) {
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

  substractEnergy(amount) {
    if (amount < 0) throw new Error("Energie darf nicht negativ sein");
    if (this.energy.current - amount < 0) {
      return { error: "Nicht genug Energie vorhanden" };
    }
    this.energy.current -= amount;
  }
}

export default PlayerClass;
