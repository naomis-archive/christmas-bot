import { userModel } from "../data/userSchema";

/**
 * Adds an item to a user's inventory. This method will also create the user if
 * it does not exist.
 * @param {string} id - The Discord id that will be used to keep track of the user.
 * @param {string} name - The user name belonging to the Discord user.
 * @param {string} item - The item to add to the user's inventory.
 * @param {string} rarity - The rarity of the item being added.
 * @return {boolean} true if the item added was not previously in the user's
 * inventory; otherwise false.
 */
const addInventoryItem = async (
  id: string,
  name: string,
  item: string,
  rarity: "rare" | "uncommon" | "common"
): Promise<boolean> => {
  try {
    // Find an existing user
    let userData = await userModel.findOne({ userId: id });

    // If user doesn't exist, create one
    if (!userData) {
      userData = await userModel.create({
        userId: id,
        username: name,
        totalItems: 0,
        uniqueItems: 0,
        inventory: { rare: [], uncommon: [], common: [] },
      });
    }

    //increment total items
    userData.totalItems++;

    // Does the user already have the item?
    const hasItem = userData.inventory[rarity].includes(item);

    // If not, give it to them
    if (!hasItem) {
      userData.inventory[rarity].push(item);
      userData.uniqueItems++;
      userData.markModified("inventory");
    }

    // Save our changes
    await userData.save();

    // Return true if they had item, false if they did not.
    return hasItem;
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const user = {
  addInventoryItem,
};
