import { ChatBots } from "./schema.js";

// The chatBotData parameter for the createChatBot function is an object that contains the data needed to create a new ChatBot.
// An example of a chatBotData object:
// {
//   age: "5 years",
//   name: "Alice's ChatBot",
//   gender: "Female",
//   personality: "Friendly",
//   user: "1234567890abcdef",  // User ID in MongoDB
//   initialCreatedDate: new Date(),
//   descriptions: "A friendly chatbot."
// }

async function getAllChatBots() {
  try {
    const chatBots = await ChatBots.find({});
    return chatBots;
  } catch (error) {
    console.error("Error retrieving all chat bots:", error);
    throw error;
  }
}

async function createChatBot(chatBotData) {
  try {
    const createdChatBot = await ChatBots.create(chatBotData);
    return createdChatBot;
  } catch (error) {
    console.error("Error creating chat bot:", error);
    throw error;
  }
}

// Function to delete all chat bots
async function deleteAllChatBots() {
  try {
    const result = await ChatBots.deleteMany({});
    console.log(`Deleted ${result.deletedCount} chat bots.`);
    return result;
  } catch (error) {
    console.error("Error deleting all chat bots:", error);
    throw error;
  }
}

async function deleteSingleChatBot(chatBotId) {
  try {
    const result = await ChatBots.deleteOne({ _id: chatBotId });
    if (result.deletedCount === 0) {
      throw new Error("No chat bot found with the provided ID.");
    }
    console.log("Chat bot deleted successfully");
    return result;
  } catch (error) {
    console.error("Error deleting chat bot:", error);
    throw error;
  }
}

async function getChatBotById(chatBotId) {
  try {
    const chatBot = await ChatBots.findById(chatBotId);
    if (!chatBot) {
      throw new Error("No chat bot found with the provided ID.");
    }
    return chatBot;
  } catch (error) {
    console.error("Error retrieving chat bot:", error);
    throw error;
  }
}

export {
  createChatBot,
  deleteAllChatBots,
  deleteSingleChatBot,
  getChatBotById,
  getAllChatBots,
};
