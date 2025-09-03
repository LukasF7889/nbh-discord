import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: String,
    properties: { type: Object },
    type: {
        type: String,
        enum: ["charisma", "intelligence", "dexterity", "strength", "perception"],
    },
    quantity: { type: Number, required: true, default: 1 },
});
export default mongoose.model("Item", itemSchema);
//# sourceMappingURL=item.js.map