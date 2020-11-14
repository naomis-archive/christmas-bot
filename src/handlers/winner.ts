import { Message } from "discord.js";
import { userModel } from "../data/userSchema";

/**
 *
 * Assigns the role to the current leader
 * @param {Message} message Discord message
 */
export const handleWinner = async (message: Message): Promise<void> => {
  if (!process.env.EVENT_ROLE) {
    console.error("Role not set.");
    return;
  }
  const winnerRole = message.guild?.roles.cache.find(
    (role) => role.name === process.env.EVENT_ROLE
  );
  if (!winnerRole) {
    console.error("Winner role not found.");
    return;
  }
  const currentWinner = await userModel
    .find()
    .sort({ uniqueItems: -1, totalItems: -1 })
    .limit(1);
  const currentWinnerUser = currentWinner[0];
  const targetUser = message.guild?.members.cache.find(
    (member) => member.id === currentWinnerUser.userId
  );
  if (!targetUser) {
    console.error("Target user not found.");
    return;
  }
  const allUsers = await message.guild?.members.fetch();
  if (!allUsers) {
    console.error("User list error");
    return;
  }
  allUsers.forEach(async (member) => {
    if (member.roles.cache.get(winnerRole.id)) {
      await member.roles.remove(winnerRole);
    }
  });
  await targetUser.roles.add(winnerRole);
};
