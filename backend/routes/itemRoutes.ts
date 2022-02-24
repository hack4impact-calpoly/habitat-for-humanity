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

//get item by itemId
router.get("/:itemId", async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId})
    res.send(item)
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

module.exports = router