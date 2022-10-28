const express = require("express");
const router = express.Router()
const Event = require('../models/eventSchema.js');
const Item = require('../models/itemSchema.js');
const User = require('../models/userSchema.js');


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
router.get("/location/:city/:address", async (req, res) => {
  try {
    const events = await Event.find({ city: req.params.city, address: req.params.address})
    res.send(events)
    console.log('Got all events with at address %s in %s', req.params.address, req.params.city)
  } catch (error) {
    res.status(400).send(error);
  }
})

/**
 * Posts a new Event to EventsDB
 * @param {string} title          title of the new Event
 * @param {Date} startTime        starting time represented as a Date object
 * @param {Date} endTime          ending time represented as a Date object
 * @param {ObjectId} volunteerId  volunteer assigned to event
 * @param {ObjectId} itemId       item to be picked up
*/
router.post('/', async (req, res) => {
  const { title, startTime, endTime, volunteerId, itemId } = req.body;
  const volunteer = await User.findOne({ _id: volunteerId })
  const item = await Item.findOne({ _id: itemId })
  const donor = await User.findOne({ _id: item.donorId })

  let newEvent = new Event({
    "title": title,
    "startTime": startTime,
    "endTime": endTime,
    "volunteerId": volunteerId,
    "itemId": itemId,
    "address": item.address,
    "city": item.city,
    "zipCode": item.zipCode,
    "volunteerFirstName": volunteer.firstName,
    "volunteerLastName": volunteer.lastName,
    "donorFirstName": donor.firstName,
    "donorLastName": donor.lastName,
    "itemName": item.name,
    "phone": donor.phone,
  });

  try {
    newEvent.save();
    res.send({msg: `${newEvent} added to the EventDB`});
  } catch (error) {
    res.status(400).send(error);
  }
});

//update event given key-value pair(s)
router.put("/eventId/:eventId", async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.eventId });

    if (req.body.title) {event.title = req.body.title;}
    if (req.body.startTime) {event.email = req.body.startTime;}
    if (req.body.endTime) {event.endTime = req.body.endTime;}
    if (req.body.volunteerId) {event.volunteerId = req.body.volunteerId;}
    if (req.body.itemId) {event.itemId = req.body.itemId;}
    if (req.body.address) {event.address = req.body.address;}
    if (req.body.city) {event.city = req.body.city;}
    if (req.body.zipCode) {event.zipCode = req.body.zipCode;}
    if (req.body.volunteerFirstName) {event.volunteerFirstName = req.body.volunteerFirstName;}
    if (req.body.volunteerLastName) {event.volunteerLastName = req.body.volunteerLastName;}
    if (req.body.donorFirstName) {event.donorFirstName = req.body.donorFirstName;}
    if (req.body.donorLastName) {event.donorLastName = req.body.donorLastName;}
    if (req.body.itemName) {event.itemName = req.body.itemName;}
    if (req.body.phone) {event.phone = req.body.phone;}

    await event.save();
    res.send({msg: `Updated event ${req.params.eventId} to: ${event}`});
  } catch(error) {
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