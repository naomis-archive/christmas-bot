import { MessageEmbed } from "discord.js";
import { userModel } from "../data/userSchema";
import { CommandInt } from "../interfaces/CommandInt";

export const inventory: CommandInt = {
  name: "inventory",
  description: "Returns the player's inventory",
  command: async (message) => {
    const { channel, author } = message;
    const userData = await userModel.findOne({ userId: author.id });
    if (!userData) {
      channel.send("You have not collected any items yet!");
      return;
    }
    const { common, uncommon, rare } = userData.inventory;
    const commonEmbed = new MessageEmbed()
      .setTitle("Common Items")
      .setDescription("You have no common items!");
    if (common.length) {
      commonEmbed.setDescription(
        `You have ${common.length} common items:\n\`\`\`md\n* ${common.join(
          "\n* "
        )}\n\`\`\``
      );
    }
    await channel.send(commonEmbed);
    const uncommonEmbed = new MessageEmbed()
      .setTitle("Uncommon Items")
      .setDescription("You have no uncommon items!");
    if (uncommon.length) {
      uncommonEmbed.setDescription(
        `You have ${
          uncommon.length
        } following uncommon items:\n\`\`\`md\n* ${uncommon.join(
          "\n *"
        )}\n\`\`\``
      );
    }
    await channel.send(uncommonEmbed);
    const rareEmbed = new MessageEmbed()
      .setTitle("Rare Items")
      .setDescription("You have no rare items!");
    if (rare.length) {
      rareEmbed.setDescription(
        `You have ${rare.length} rare items:\n\`\`\`md\n* ${rare.join(
          "\n *"
        )}\n\`\`\``
      );
    }
    await channel.send(rareEmbed);
  },
};
