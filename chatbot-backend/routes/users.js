import express from "express";
import { User } from "../data/schema.js";

import {
  createUser,
  getUserById,
  getUserByUsername,
} from "../data/User-dao.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkToken from "./checkToken.js";

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(422).json({ error: "Name is required" });
  }

  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(422).json({ error: "Password is required" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ error: "Passwords do not match" });
  }

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res
        .status(422)
        .json({ error: "Email already exists, please use another email" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: "./avatar1.jpeg", // Ensure the path is correct and accessible
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully!",
      user: { id: user._id, name, email },
    });
  } catch (error) {
    console.error("Registration Error: ", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// LOGIN USER
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(422).json({ error: "Password is required" });
  }

  /*
       CHECK IF USER EXISTS
       - if found, user object is returned with all the user data!
      */
  const user = await User.findOne({ email: email }).select("+password");

  // If user does not exist
  if (!user) {
    return res
      .status(404)
      .json({ error: "No user was found with this email." });
  }

  /* \
          CHECK IF PASSWORD MATCHES
          - uses bcrypt to compare the password returned by User.findOne()
              with the hashed password
          - if found, continue
      */

  const checkPassword = await bcrypt.compare(password, user.password);
  // If password doesn't match
  if (!checkPassword) {
    return res.status(422).json({ error: "Wrong password, try again." });
  }

  // JWT
  try {
    const secret = process.env.JWT_SECRET;

    // Create token with user id and the secret from .env
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn: "1h" }
    );

    let userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.status(200).json({
      message: "User logged in successfully!",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong, try again later" });
  }
});

router.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  /*
       Check if user exists
       - passowrd is excluded from the query by the '-password' argument (filter)
       - if found, user object is returned without the password
               because we don't want to send the password to the frontend
      */
  const user = await User.findById(id, "-password");

  // If user isn't found
  if (!user) {
    return res.status(404).json({ error: "User is not found" });
  }

  res.status(200).json({ user });
});

// UPDATE USER
router.put("/user/:id", checkToken, async (req, res) => {
  const { name, email, avatar, password } = req.body;

  try {
    // Find the user by ID first
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If a new password is provided, hash it before storing it
    if (password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Update the other fields
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.avatar = avatar ?? user.avatar;

    // Save the updated user document
    await user.save();

    // Respond with the updated user information
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

export default router;
