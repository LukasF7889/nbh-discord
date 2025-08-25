import Player from "../models/player.js";

const addItemToInventory = async (player, item) => {
  //Validate item
  if (!item || !item.name) return;
  const quantity =
    typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;

  console.log("Add item:", item.name);

  const hasItem = player.items.find((i) => i.name === item.name);

  if (hasItem && hasItem.quantity >= 1) {
    hasItem.quantity += quantity;
    console.log("Increase quantity", hasItem.quantity, quantity);
  } else {
    player.items.push({
      name: item.name,
      type: item.type || "unknown",
      properties: item.properties || {},
      quantity: quantity,
    });
    console.log(player.items);
  }
};

export default addItemToInventory;
