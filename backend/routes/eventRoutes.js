import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import Event from '../models/eventSchema.js';


//get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({})
    res.send(events)
    console.log("Got all events")
  } catch (error) {
    res.status(400).send(error);
  }
})

//get event by eventId
router.get("/eventId/:eventId", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId})
    res.status(200).send(event)
    console.log('Got event with id %s', req.params.eventId)
    console.log(event)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all events by title
router.get("/title/:title", async (req, res) => {
  try {
    const events = await Event.find({title: req.params.title})
    res.send(events)
    console.log('Got all events with title %s', req.params.title)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all events by location
router.get("/location/:location", async (req, res) => {
  try {
    const events = await Event.find({location: req.params.location})
    res.send(events)
    console.log('Got all events with location %s', req.params.location)
  } catch (error) {
    res.status(400).send(error);
  }
})

router.use(express.json());

//posts a new Event to EventsDB
router.post('/', async (req, res) => {
  const { title, pick_up_availability, location } = req.body;
  let event = new Event({
    title,
    pick_up_availability,
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