import { Client, TextChannel } from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { COMMANDS } from "./commands/_COMMANDS";
import { spawner } from "./handlers/spawn";

//config
dotenv.config();
const bot = new Client();
const dbString = process.env.DB_URI || "";

//connect DB
mongoose.connect(
  dbString,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.info("Database connected!");
  }
);

//connect bot
bot.login(process.env.TOKEN);

//On load, find event channel and set spawn interval
bot.on("ready", () => {
  console.log("Bot Ready!");
  //locate channel
  const targetChannel = bot.channels.cache.find((chan) => {
    return chan.id === process.env.EVENT_CHANNEL_ID;
  });
  //handle failure
  if (!targetChannel) {
    console.error("Event channel not found.");
    return;
  }
  //initial message
  spawner(targetChannel as TextChannel);

  //set interval for spawning
  //TODO: make timer an env config?
  setInterval(() => spawner(targetChannel as TextChannel), 600000);
});

//TODO: handle other commands on message event
// At least inventory and high score commands
bot.on("message", async (message) => {
  //TODO: add scoreboard logic
  if (!message.content.startsWith("c!")) {
    return;
  }
  for (const COMMAND of COMMANDS) {
    if (message.content.startsWith(`c!${COMMAND.name}`)) {
      await COMMAND.command(message);
      return;
    }
  }
});
