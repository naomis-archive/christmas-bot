import { Message } from "discord.js";

export interface CommandInt {
  name: string;
  description: string;
  command: (message: Message) => Promise<void>;
}
