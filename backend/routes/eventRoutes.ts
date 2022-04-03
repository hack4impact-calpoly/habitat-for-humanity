import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import Event from '../models/eventSchema';

//get all events
router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({})
    res.status(200).send(events);
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

//get all events by title
router.get("/:title", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({title: req.params.title})
    res.send(events)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all events by start_date
router.get("/:startDate", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({start_date: req.params.startDate})
    res.send(events)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all events by end_date
router.get("/:endDate", async (req: Request, res: Response) => {
  try {
    const events = await Event.find({end_date: req.params.endDate})
    res.send(events)
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

router.use(express.json());

//posts a new Event to EventsDB
router.post('/', async (req: Request, res: Response) => {
  const { title, start_date, end_date, location } = req.body;
  let event = new Event({
    title,
    start_date,
    end_date,
    location
  });

  try {
    event = await event.save();
    console.log(event);
    res.json(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router