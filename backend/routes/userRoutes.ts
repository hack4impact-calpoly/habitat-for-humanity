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

// //get all donor
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

module.exports = router