import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * This schema represents Users in the database.
 */
const userSchema = new Schema(
  {
    name: { type: String, unique: true, required: true }, // Each user must have a unique username
    email: String,
    avatar: { type: String, default: "avatar1.jpeg" }, // Path or URL to the user avatar image
    password: String,
    ChatBots: [{ type: Schema.Types.ObjectId, ref: "ChatBots" }], // This is how we reference a different collection.
  },
  {
    /* This second object allows us to specify more config info. In this case, 
    we're enabling automatic timetamps using the default options. */
    timestamps: {},
  }
);

// Actually create the User schema
export const User = mongoose.model("User", userSchema);

/**
 * This schema represents Pets in the database.
 */
const ChatBotsSchema = new Schema(
  {
    age: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    personality: { type: String, required: true },
    avatar: { type: String, default: "avatar1.jpg" },
    initialCreatedDate: Date,
    descriptions: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {},
  }
);

// Actually create the Pet schema
export const ChatBots = mongoose.model("ChatBots", ChatBotsSchema);
