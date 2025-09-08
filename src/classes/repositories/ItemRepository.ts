import { ItemModel } from "../entities/ItemClass.js";

class ItemRepository {
  getItem = async (att: string) => {
    const item = await ItemModel.aggregate([
      { $match: { type: att } },
      { $sample: { size: 1 } },
    ]);
    return item[0] || null;
  };
}

export default new ItemRepository();
