import mongoose from "mongoose";
import Item from "../models/item.js";
import dotenv from "dotenv";

dotenv.config();

const createItems = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("Datenbank connection missing");
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    await Item.deleteMany({});
    console.log("Items entfernt");

    const objects = await Item.create(
      {
        name: "Intelligence Ticket",
        properties: {},
        type: "intelligence",
        quantity: 1,
      },
      {
        name: "Charisma Ticket",
        properties: {},
        type: "charisma",
        quantity: 1,
      },
      {
        name: "Strength Ticket",
        properties: {},
        type: "strength",
        quantity: 1,
      },
      {
        name: "Dexterity Ticket",
        properties: {},
        type: "dexterity",
        quantity: 1,
      },
      {
        name: "Perception Ticket",
        properties: {},
        type: "perception",
        quantity: 1,
      }
    );
    console.log("Objects created");

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

createItems();
