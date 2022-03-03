import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import User from '../models/userSchema';

//get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get user by userId
router.get("/:userId", async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ _id: req.params.userId})
      res.send(user)
    } catch (error) {
      res.status(400).send(error);
    }
})

//get all volunteers
router.get("/volunteers", async (req: Request, res: Response) => {
  try {
    const volunteers = await User.find({userType: "Volunteer"})
    res.send(volunteers)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all donors
router.get("/donors", async (req: Request, res: Response) => {
  try {  
    const donor = await User.find({userType: "Donor"})
    res.send(donor)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all admins
router.get("/admins", async (req: Request, res: Response) => {
  try {  
    const admins = await User.find({userType: "Admin"})
    res.send(admins)
  } catch (error) {
    res.status(400).send(error);
  }
})

//add new User to UsersDB
router.post("/", async (req: Request, res: Response) => {
  try {  
    const { 
      userType,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;
    const newUser = new User({
      userType,
      firstName,
      lastName,
      email,
      phone,
    });
    // console.log(newUser);
    await newUser.save();
    res.send(`${firstName} ${lastName} added to the userDB`);
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
})

//update user firstName
router.put("/:userId/firstName", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ _id: req.params.userId })
    user.firstName = req.body.firstName;

    await user.save();

    res.send(
      `Updated user "${req.params.userId}" with new firstName: "${req.body.firstName}"`
    );
    
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
})

//update user lastName
router.put("/:userId/lastName", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ _id: req.params.userId })
    user.lastName = req.body.lastName;

    await user.save();

    res.send(
      `Updated user "${req.params.userId}" with new lastName: "${req.body.lastName}"`
    );
    
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
})

//update user email
router.put("/:userId/email", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ _id: req.params.userId })
    user.email = req.body.email;

    await user.save();

    res.send(
      `Updated user "${req.params.userId}" with new email: "${req.body.email}"`
    );
    
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
})

//update user phone
router.put("/:userId/phone", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ _id: req.params.userId })
    user.phone = req.body.phone;

    await user.save();

    res.send(
      `Updated user "${req.params.userId}" with new phone number: "${req.body.phone}"`
    );
    
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send(errorMessage);
    console.log(`Error: ${errorMessage}`);
  }
})

module.exports = router