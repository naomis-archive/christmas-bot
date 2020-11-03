import { MessageEmbed, TextChannel } from "discord.js";

export const spawner = (channel: TextChannel) => {
  const spawnEmbed = new MessageEmbed()
    .setTitle("Test Spawn!")
    .setDescription("Does this work?");
  channel.send(spawnEmbed);
};
