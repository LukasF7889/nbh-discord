import Item from "../models/item.js";

const getItem = async (att) => {
  const item = await Item.aggregate([
    { $match: { type: att } },
    { $sample: { size: 1 } },
  ]);
  return item[0] || null;
};

export default getItem;
