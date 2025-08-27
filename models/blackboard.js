import mongoose from "mongoose";
import { missionSchema } from "./mission.js";
import Blackboard from "../classes/entities/BlackBoardClass.js";

const blackboardSchema = new mongoose.Schema({
  currentMissions: [missionSchema],
  lastUpdated: Date,
  key: String,
});

export default mongoose.model("Blackboard", blackboardSchema);

// Converting mongoose document into a oop class
export function toBlackboardClass(doc) {
  if (!doc) return null;

  //check if it is a mongoose document
  if (typeof doc.toObject === "function") {
    // .toObject() removes mongoose specific fields
    return new Blackboard(doc.toObject());
  } else {
    return new Blackboard(doc);
  }
}
