import { MessageEmbed } from "discord.js";
import { userModel } from "../data/userSchema";
import { CommandInt } from "../interfaces/CommandInt";

export const scoreboard: CommandInt = {
  name: "scoreboard",
  description: "Returns the top 10 users",
  command: async (message) => {
    const scoreList = await userModel
      .find()
      .sort({ uniqueItems: -1, totalItems: -1 });
    const topScores = scoreList.slice(0, 9);
    const user = scoreList.find((el) => el.userId === message.author.id);
    if (!user) {
      await message.channel.send("You have not played yet!");
      return;
    }
    const userPosition = scoreList.indexOf(user);
    let count = 0;
    let scoreDesc = "";
    topScores.forEach((player) => {
      scoreDesc += `${++count}. ${player.username} - ${player.uniqueItems} \n`;
    });
    const scoreEmbed = new MessageEmbed()
      .setTitle("Scoreboard!")
      .setDescription(`\`\`\`md\n${scoreDesc}\`\`\``);
    await message.channel.send(scoreEmbed);
    await message.channel.send(
      `You are in place ${userPosition + 1} with ${user.uniqueItems} items!`
    );
  },
};
