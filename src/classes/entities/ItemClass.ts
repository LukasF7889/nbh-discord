import { getModelForClass, prop } from "@typegoose/typegoose";

class ItemClass {
  @prop({ required: true, unique: true })
  name: string = "undefined";

  @prop({ required: true })
  properties: Record<string, any> = {};

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
}

export const ItemModel = getModelForClass(ItemClass);
export default ItemClass;
