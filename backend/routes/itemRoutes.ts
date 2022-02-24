import { Request, Response } from 'express';
const express = require("express");
const router = express.Router()
import Item from '../models/itemSchema';

//get all items
router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await Item.find({})
    res.send(items)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get item by itemId
router.get("/:itemId", async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId})
    res.send(item)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with name
router.get("/:name", async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ name: req.params.name})
    res.send(items)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with location
router.get("/:location", async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ location: req.params.location})
    res.send(items)
  } catch (error) {
    res.status(400).send(error);
  }
})

//get all items with donorId
router.get("/:donorId", async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ donor_id: req.params.donorId})
    res.send(items)
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router