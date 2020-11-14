import { Message, MessageEmbed, TextChannel } from "discord.js";
import { characters } from "../data/characters";
import { user } from "../handlers/user";
import { handleWinner } from "./winner";

export const spawner = async (channel: TextChannel): Promise<void> => {
  //TODO: Generate random character.
  const randomChar = characters[Math.floor(Math.random() * characters.length)];

  //TODO: Select random item to award from character object.
  // Maybe scale of 1-10, with 10 being rare, 6-9 being uncommon
  // and 1-5 being common?
  const randomNum = Math.floor(Math.random() * 100);
  const randomItem =
    randomNum >= 95
      ? randomChar.rareItem
      : randomNum >= 85
      ? randomChar.uncomItem
      : randomChar.comItem;

  // variable for rarity
  const rarity =
    randomNum >= 95 ? "rare" : randomNum >= 85 ? "uncommon" : "common";

  // Randomly select valid command
  const commandFlip = Math.floor(Math.random() * 100);
  const goodCommand = commandFlip < 50 ? "c!naughty" : "c!nice";
  const badCommand = commandFlip < 50 ? "c!nice" : "c!naughty";

  //TODO: Change hard coded to random character from above
  // Use template literals to create the title and description.
  const spawnEmbed = new MessageEmbed()
    .setTitle(randomChar.name)
    .setDescription("TODO")
    .setFooter(`Reward them with \`${goodCommand}\`.`);
  const embeddedMessage = await channel.send(spawnEmbed);

  //await responses
  const collector = await channel.awaitMessages(
    (message: Message) => {
      // When a message has one of the valid commands, collect it; otherwise filter it out.
      return [goodCommand, badCommand].includes(message.content.toLowerCase());
    },
    //wait for 10 seconds, resolve on first valid message
    { time: 10000, max: 1 }
  );

  // Get the first valid message received.
  const winningMessage = collector.first();

  if (!winningMessage) {
    // Handle no valid message received.
    const timeEmbed = new MessageEmbed()
      .setTitle("Too late!")
      .setDescription("No one helped them so they left!");

    embeddedMessage.edit(timeEmbed);
    return;
  }

  // If the winning message is deletable, remove it.
  if (winningMessage.deletable) {
    winningMessage.delete();
  }

  // Storing the winning message author and command received.
  const winner = winningMessage.author;
  const commandReceived = winningMessage.content.toLowerCase();

  if (commandReceived !== goodCommand) {
    // Handle incorrect command received.
    const loseEmbed = new MessageEmbed()
      .setTitle("Oh no!")
      .setDescription(
        `<@!${winner.id}> used the wrong command and now Santa is sad.`
      );

    embeddedMessage.edit(loseEmbed);
    return;
  }

  // Handle correct command received.
  // Add the item to the user's inventory and determine if it was new.
  const hadItem = await user.addInventoryItem(
    winner.id,
    winner.username,
    randomItem,
    rarity
  );

  const description = !hadItem
    ? `They give <@!${winner.id}> ${randomItem}! This was a ${rarity} item.`
    : `<@!${winner.id}> already had ${randomItem}.`;

  const winEmbed = new MessageEmbed()
    .setTitle("Success!")
    .setDescription(description);

  embeddedMessage.edit(winEmbed);
  await handleWinner(winningMessage);
};
