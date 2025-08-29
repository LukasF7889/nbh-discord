import type { missionType } from "./missionType.js";

export interface blackboardType {
  currentMissions: missionType[];
  lastUpdated: Date;
  refreshTime: number;
  key: string;
}
