import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import Item from '../models/itemSchema';

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
})

module.exports = router