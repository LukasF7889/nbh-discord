export interface MissionType {
  _id: string;
  title: string;
  duration: number;
  description: string;
  difficulty: string;
  challenge: {
    intelligence: number;
    charisma: number;
    strength: number;
    dexterity: number;
    perception: number;
  };
  message: {
    [key: string]: string;
  };
}
