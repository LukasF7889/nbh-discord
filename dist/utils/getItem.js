import { ItemModel } from "../classes/entities/ItemClass.js";
const getItem = async (att) => {
    const item = await ItemModel.aggregate([
        { $match: { type: att } },
        { $sample: { size: 1 } },
    ]);
    return item[0] || null;
};
export default getItem;
//# sourceMappingURL=getItem.js.map