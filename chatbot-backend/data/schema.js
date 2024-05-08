import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * This schema represents Users in the database.
 */
const userSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    email: String,
    avatar: { type: String, default: "avatar1.jpeg" },
    password: String,
    loginTime: { type: Number, default: 0 },
    ChatBots: [{ type: Schema.Types.ObjectId, ref: "ChatBots" }],
  },
  {
    timestamps: {},
  }
);

// Actually create the User schema
export const User = mongoose.model("User", userSchema);

/**
 * This schema represents chatbots in the database.
 */
const ChatBotsSchema = new Schema(
  {
    age: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    personality: { type: String, required: true },
    avatar: { type: String, default: "avatar2.jpeg" },
    descriptions: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {},
  }
);

// Actually create the schema
export const ChatBots = mongoose.model("ChatBots", ChatBotsSchema);
