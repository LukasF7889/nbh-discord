import { getModelForClass, prop } from "@typegoose/typegoose";

class ItemClass {
  @prop({ required: true, unique: true })
  name: string = "undefined";

  @prop({ required: true })
  type:
    | "charisma"
    | "intelligence"
    | "dexterity"
    | "strength"
    | "perception"
    | "unknown" = "unknown";

  @prop({ required: true, default: 1 })
  quantity: number = 1;

  constructor(data?: Partial<ItemClass>) {
    Object.assign(this, data); // fills all fields
  }
}

export const ItemModel = getModelForClass(ItemClass, {
  schemaOptions: { collection: "items" },
});
export default ItemClass;
