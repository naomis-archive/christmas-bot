import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import { characters } from "../data/characters";

export const spawner = async (channel: TextChannel) => {
  //TODO: Generate random character.
  const random = characters.length;

  //TODO: Select random item to award from character object.
  // Maybe scale of 1-10, with 10 being rare, 6-9 being uncommon
  // and 1-5 being common?
  const randomItem = 0;

  //TODO: Refactor to random chance of one of these being correct.
  const goodCommand = "naughty";
  const badCommand = "nice";

  //TODO: Change hard coded to random character from above
  // Use template literals to create the title and description.
  const spawnEmbed = new MessageEmbed()
    .setTitle("Test Spawn!")
    .setDescription("Does this work?")
    .setFooter(`Reward them with \`${goodCommand}\`.`);
  const embeddedMessage = await channel.send(spawnEmbed);

  //await responses
  const collector = await channel.awaitMessages(
    (message: Message) => {
      if (message.content.toLowerCase() === goodCommand) {
        //handle correct response
        //storing winner
        const winner = message.author;

        //TODO: Add database logic here.

        //TODO: Conditional description - should be different if
        // winner already has item.
        const winEmbed = new MessageEmbed()
          .setTitle("Success!")
          .setDescription(`They give <@!${message.author.id}> a neat item!`);
        embeddedMessage.edit(winEmbed);
        return true;
      }

      //handle incorrect response
      if (message.content.toLowerCase() === badCommand) {
        const loseEmbed = new MessageEmbed()
          .setTitle("Oh no!")
          .setDescription(
            `<@!${message.author.id}> used the wrong command and now Santa is sad.`
          );
        embeddedMessage.edit(loseEmbed);
        //return true here to still pass filter
        return true;
      }
      //filter out invalid responses
      return false;
    },
    //wait for 10 seconds, resolve on first valid message
    { time: 10000, max: 1 }
  );

  //handle no valid response
  if (!collector.first) {
    const timeEmbed = new MessageEmbed()
      .setTitle("Too late!")
      .setDescription("No one helped them so they left!");
    embeddedMessage.edit(timeEmbed);
  }
};
