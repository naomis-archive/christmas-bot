import { userModel } from "../data/userSchema";

/**
 * Adds an item to a user's inventory. This method will also create the user if
 * it does not exist.
 * @param {string} id - The Discord id that will be used to keep track of the user.
 * @param {string} name - The user name belonging to the Discord user.
 * @param {string} item - The item to add to the user's inventory.
 * @return {boolean} true if the item added was not previously in the user's
 * inventory; otherwise false.
 */
const addInventoryItem = async (
  id: string,
  name: string,
  item: string
): Promise<boolean> => {
  try {
    // Find an existing user (or create one) and add the item to the user's
    // inventory. This call returns the user as it existed before the update.
    const found = await userModel.findOneAndUpdate(
      {
        // Find user with this Discord User ID
        userId: id,
      },
      {
        // If upserting a new user, set the username.
        $setOnInsert: {
          username: name,
        },
        // Add the item to the user's inventory.
        $addToSet: { inventory: item },
      },
      {
        upsert: true,
      }
    );

    // Check if the item was newly added to the user's inventory. Since the user
    // returned above is in the state prior to the update, if the item exists in
    // the inventory this user already had the item. If the user was upserted
    // above, the found user will be null, but this also means the item was
    // newly added.
    const itemAdded = !found?.inventory.includes(item);
    return Promise.resolve(itemAdded);
  } catch (err) {
    console.log(err);
    return Promise.resolve(false);
  }
};

export const user = {
  addInventoryItem,
};
