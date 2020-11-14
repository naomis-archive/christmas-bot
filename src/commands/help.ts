import { Message, MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import { COMMANDS } from "./_COMMANDS";

export const help: CommandInt = {
  name: "help",
  description: "Provides information on using the bot, and playing the game",
  command: async (message) => {
    // Initial embed
    const helpEmbed = new MessageEmbed().setTitle(
      "Welcome to the Christmas Game!"
    );

    // Get channel name for event
    const eventChannel = message.guild?.channels.cache.find(
      (chan) => chan.id === process.env.EVENT_CHANNEL_ID
    );

    // Get role name for the event
    const eventRole = message.guild?.roles.cache.find(
      (role) => role.name === process.env.EVENT_ROLE
    );
    // How to play
    helpEmbed.addField(
      "How to Play",
      `To play the game, head over to the #${eventChannel?.name} channel. There you will see various Christmas characters show up. But we have one problem! Santa needs help determining if these characters are *naughty* or *nice*! So, use the command given by the character to let Santa know! If you are the first to use the correct command, you'll be rewarded with a neat item! But be careful - if you use the wrong command, Santa will be very sad. The person with the most items will be crowned the <@&${eventRole?.id}>!`
    );

    // Create commands string
    let commandString = "";
    COMMANDS.forEach((COMMAND) => {
      commandString += `\`c!${COMMAND.name}\` - ${COMMAND.description}\n`;
    });
    // Commands
    helpEmbed.addField(
      "Available Commands",
      `These are the available commands: \n ${commandString}`
    );

    // Source Code
    helpEmbed.addField(
      "Found a bug?",
      "If you found a bug, or want to contribute, or just want to see the code, check out my [GitHub Repository](https://github.com/nhcarrigan/christmas-bot)~!"
    );

    await message.channel.send(helpEmbed);
  },
};
