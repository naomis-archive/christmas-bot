import { spawn } from "child_process";
import { Client, TextChannel } from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { spawner } from "./handlers/spawn";

//config
dotenv.config();
const bot = new Client();
const dbString = process.env.DB_URI || "";

//connect DB
mongoose.connect(dbString, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.info("Database connected!");
});

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
  setInterval(() => spawner(targetChannel as TextChannel), 60000);
});

//TODO: handle other commands on message event
// At least inventory and high score commands
bot.on("message", (message) => {
  //TODO: add inventory logic
  //TODO: add scoreboard logic
});
