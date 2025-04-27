// import { Request, Response } from 'express';
const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const { clerkClient } = require("@clerk/express");
const User = require("../models/userSchema.js");

// Clerk User update metadata
router.post("/updateRole", async (req, res) => {
  const { role, userId } = req.body;
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });
  res.status(200).json({ success: true });
});

// Get Clerk user info by userId
router.get("/clerk/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await clerkClient.users.getUser(userId);
    const { firstName, lastName, primaryEmailAddress } = user;

    res.status(200).json({
      firstName,
      lastName,
      email: primaryEmailAddress.emailAddress,
    });
  } catch (err) {
    console.error("[CLERK_FETCH_ERROR]", err);
    res.status(500).json({ error: "Failed to fetch Clerk user" });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get user by userId
router.get("/id/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await User.find({ userType: "volunteer" }).exec();
    res.send(volunteers);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all donors
router.get("/donors", async (req, res) => {
  try {
    const donor = await User.find({ userType: "donor" });
    res.send(donor);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ userType: "administrator" });
    res.send(admins);
  } catch (error) {
    res.status(400).send(error);
  }
});

//add new User to UsersDB
router.post("/", async (req, res) => {
  try {
    const { userType, firstName, lastName, email, phone, id } = req.body;
    const newUser = new User({
      userType,
      firstName,
      lastName,
      email,
      phone,
      id,
    });
    await newUser.save();
    res.send({ msg: `${firstName} ${lastName} added to the userDB` });
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
});

//update user info
router.put("/updateUserInfo/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userInfo = req.body;

    const updatedUser = await clerkClient.users.updateUser(userId, userInfo);

    res.send({
      msg: `Updated user "${userId}" with new info:`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).send({
      msg: "Failed to update user info",
      error: error.message,
    });
  }
});

//update user lastName
router.put("/lastName/:userId", async (req, res) => {
  try {
    let user = await User.findOne({ id: req.params.userId });
    user.lastName = req.body.lastName;

    await user.save();

    res.send({
      msg: `Updated user "${req.params.userId}" with new lastName: "${req.body.lastName}"`,
    });
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
});

//update user email
router.put("/email/:userId", async (req, res) => {
  try {
    let user = await User.findOne({ id: req.params.userId });
    user.email = req.body.email;

    await user.save();

    res.send({
      msg: `Updated user "${req.params.userId}" with new email: "${req.body.email}"`,
    });
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
});

//update user phone
router.put("/phone/:userId", async (req, res) => {
  try {
    let user = await User.findOne({ id: req.params.userId });
    user.phone = req.body.phone;

    await user.save();
    console.log(req.body.phone);
    res.send({
      msg: `Updated user "${req.params.userId}" with new phone number: "${req.body.phone}"`,
    });
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
});

module.exports = router;
