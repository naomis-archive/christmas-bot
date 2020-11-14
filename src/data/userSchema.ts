import { Document, model, Schema } from "mongoose";

export interface UserInt extends Document {
  userId: string;
  username: string;
  inventory: string[];
  totalItems: number;
}

const user = new Schema({
  userId: String,
  username: String,
  inventory: Array,
  totalItems: Number,
});

export const userModel = model<UserInt>("user", user);
