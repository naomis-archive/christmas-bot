import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import { characters } from "../data/characters";

export const spawner = async (channel: TextChannel) => {
  //TODO: Generate random character.
  const random = characters.length;

  //TODO: Refactor to random.
  const goodCommand = "naughty";
  const badCommand = "nice";

  //declare winner variable at this scope
  let winner: User | undefined;

  //TODO: Change hard coded to random character from above
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
        const winEmbed = new MessageEmbed()
          .setTitle("Success!")
          .setDescription(`They give <@!${message.author.id}> a neat item!`);
        embeddedMessage.edit(winEmbed);
        winner = message.author;
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

  //handle no response
  if (!collector.first) {
    const timeEmbed = new MessageEmbed()
      .setTitle("Too late!")
      .setDescription("No one helped them so they left!");
    embeddedMessage.edit(timeEmbed);
  }

  //handle winner
  if (winner) {
    // TODO: Database to store items per user
    // Handle DB call in different file, import here.
    channel.send(`<@!${winner.id} won!>`);
  }
};
