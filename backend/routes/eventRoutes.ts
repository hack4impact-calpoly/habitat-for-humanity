import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import Event from '../models/eventSchema';

//get all events
router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({})
    res.send(events)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get event by eventId
router.get("/:eventId", async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId})
    res.send(event)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all events by location
router.get("/:location", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({location: req.params.location})
    res.send(events)
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router