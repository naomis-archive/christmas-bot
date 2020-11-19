import { MessageEmbed, MessageReaction } from "discord.js";
import { userModel } from "../data/userSchema";
import { CommandInt } from "../interfaces/CommandInt";
import { inventoryPaginator } from "../handlers/inventoryPaginator";

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
    const itemsPerPage = 10;

    const paginator = inventoryPaginator(
      [common, uncommon, rare],
      ["common", "uncommon", "rare"],
      itemsPerPage
    );

    const page = paginator.pageForward();
    const inventoryEmbed = new MessageEmbed()
      .setTitle(`Inventory for @${author.username}`)
      .setDescription(page.content)
      .setFooter(page.footer);
    const inventoryMessage = await channel.send(inventoryEmbed);

    // Add reactions to be used for paging through inventory.
    const emojiList = ["◀", "▶"];
    const reacts = emojiList.map((emoji) => inventoryMessage.react(emoji));
    await Promise.all(reacts);

    // Filter used by collector so we only handle the paging reactions.
    const emojiFilter = (reaction: MessageReaction) => {
      return emojiList.includes(reaction.emoji.name);
    };

    // Create a collector to monitor for reactions on the inventory message.
    const collector = await inventoryMessage.createReactionCollector(
      emojiFilter,
      {
        time: 60000,
        dispose: true,
      }
    );

    // Helper function which pages based upon the reaction pressed and redisplays the inventory list.
    const emojiPager = (reaction: MessageReaction) => {
      const page =
        reaction.emoji.name === "▶"
          ? paginator.pageForward()
          : paginator.pageBackward();

      const inventoryEmbed = new MessageEmbed()
        .setTitle(`Inventory for @${author.username}`)
        .setDescription(page.content)
        .setFooter(page.footer);

      inventoryMessage.edit(inventoryEmbed);
    };

    // Wire up the paging helper function to the collectors collect & remove events.
    collector.on("collect", emojiPager);
    collector.on("remove", emojiPager);
  },
};
