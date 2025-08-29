import { mythTypes } from "../config/mythTypes.js";
import type { itemType } from "./itemType.js";

export interface PlayerType {
  discordId: string;
  username: string;
  xp: number;
  level: number;
  mythos: string;
  money: number;
  energy: {
    current: number;
    max: number;
  };
  type: keyof typeof mythTypes;
  skills: {
    charisma: number;
    strength: number;
    intelligence: number;
    dexterity: number;
    perception: number;
  };
  items: itemType[];
}
