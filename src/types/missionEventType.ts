export interface MissionEventType {
  description: string;
  type: "strength" | "dexterity" | "charisma" | "intelligence" | "perception";
  difficulty: number;
}
