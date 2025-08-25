class Player {
  constructor({
    discordId,
    username,
    level,
    xp,
    money,
    energy,
    mythos,
    type,
    skills,
    items,
  }) {
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
}

export default Player;
