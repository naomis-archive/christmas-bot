import { Document, model, Schema } from "mongoose";

export interface UserInt extends Document {
  userId: string;
  username: string;
  inventory: string[];
}

const user = new Schema({
  userId: String,
  username: String,
  inventory: Array,
});

export const userModel = model<UserInt>("user", user);
