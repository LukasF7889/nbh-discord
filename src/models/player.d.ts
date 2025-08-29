import mongoose from "mongoose";
import PlayerClass from "../classes/entities/PlayerClass.js";

declare const Player: mongoose.Model<any>;
export default Player;

export function toPlayerClass(doc: any): PlayerClass;
