const express = require("express");
const router = express.Router()
const Item = require('../models/itemSchema');
router.use(express.json());


//get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({})
    res.send(items)
    console.log("Got all items")
  } catch (error) {
    res.status(400).send(error);
  }
})

//get item by itemId
router.get("/itemId/:itemId", async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId})
    res.send(item)
    console.log('Got item with id %s', req.params.itemId)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with name
router.get("/name/:name", async (req, res) => {
  try {
    const items = await Item.find({ name: req.params.name})
    res.send(items)
    console.log('Got all items with name %s', req.params.name)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with location
router.get("/location/:city/:address", async (req, res) => {
  try {
    const items = await Item.find({ city: req.params.city, address: req.params.address})
    res.send(items)
    console.log('Got all items with at address %s in %s', req.params.address, req.params.city)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with donorId
router.get("/donorId/:donorId", async (req, res) => {
  try {
    const items = await Item.find({ donor_id: req.params.donorId})
    res.send(items)
    console.log('Got all items with donorId %s', req.params.donorId)
  } catch (error) {
    res.status(400).send(error);
  }
});

//add new item to ItemDB
router.post("/", async (req, res) => {
  try {  
    const { 
      name,
      images,
      size,
      address,
      city,
      zipCode,
      scheduling,
      timeAvailability,
      donorId,
      timeSubmitted,
      status
    } = req.body;
    const newItem = new Item({
      name,
      images,
      size,
      address,
      city,
      zipCode,
      scheduling,
      timeAvailability,
      donorId,
      timeSubmitted,
      status
    });

    // //validate provided availability is [[startTime, endTime], ...]
    // for (let i = 0; i < req.body.timeAvailability.length; i++) {
    //   if (req.body.timeAvailability[i].length !== 2) {
    //     res.status(400).send(
    //       {error: `Availability provided not in format [[startTime, endTime]]: "${req.body.availability}"`}
    //       );
    //   }
    // }
    // console.log(newUser);
    await newItem.save();
    res.send({msg: `${newItem} added to the ItemDB`});
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) { 
      errorMessage = error.message; 
    } else { 
      errorMessage = String(errorMessage); 
    }
    res.status(400).send({error: errorMessage});
    console.log(`Error: ${errorMessage}`);
  }
});

//update item given key-value pair(s)
router.put("/itemId/:itemId", async (req, res) => {
  try {
    let item = await Item.findOne({ _id: req.params.itemId });

    if (req.body.name) {item.name = req.body.name;}
    if (req.body.images) {item.images = req.body.images;}
    if (req.body.size) {item.size = req.body.size;}
    if (req.body.address) {item.address = req.body.address;}
    if (req.body.city) {item.city = req.body.city;}
    if (req.body.address) {item.address = req.body.address;}
    if (req.body.zipCode) {item.zipCode = req.body.zipCode;}
    if (req.body.scheduling) {item.scheduling = req.body.scheduling;}
    if (req.body.timeAvailability) {item.timeAvailability = req.body.timeAvailability;}
    if (req.body.donorId) {item.donorId = req.body.donorId;}
    if (req.body.timeSubmitted) {item.timeSubmitted = req.body.timeSubmitted;}
    if (req.body.timeApproved) {item.timeApproved = req.body.timeApproved;}
    if (req.body.status) {item.status = req.body.status;}

    await item.save();
    res.send({msg: `Updated item ${req.params.itemId} to: ${item}`});
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

//add new Item to ItemDB
router.post("/", async (req, res) => {
  try {  
    const { 
      name,
      email,
      phone,
      images,
      size,
      address,
      city,
      zipCode,
      donorId,
      notes,
      timeSubmitted,
      status
    } = req.body;
    const newItem = new Item({
      name,
      email,
      phone,
      images,
      size,
      address,
      city,
      zipCode,
      donorId,
      notes,
      timeSubmitted,
      status
    });
    await newItem.save();
    res.send({msg: `${name} added to the ItemDB`});
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