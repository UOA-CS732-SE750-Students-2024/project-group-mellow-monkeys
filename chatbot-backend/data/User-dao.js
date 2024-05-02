import { User } from "./schema.js";

async function createUser(userData) {
  try {
    const createdUser = await User.create(userData);
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function deleteSingleUser(userId) {
  try {
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new Error("No user found with the provided ID.");
    }
    console.log("User deleted successfully");
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

async function deleteAllUsers() {
  try {
    await User.deleteMany({});
    console.log("All users data is cleared successfully");
  } catch (err) {
    console.error("Failed to clear database:", err);
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User not found with the given username");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
}

export {
  createUser,
  deleteAllUsers,
  deleteSingleUser,
  getUserById,
  getUserByUsername,
};
