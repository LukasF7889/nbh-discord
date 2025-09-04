import type { MissionType } from "./missionType.js";

export interface blackboardType {
  currentMissions: MissionType[];
  lastUpdated: Date;
  refreshTime: number;
  key: string;
}
