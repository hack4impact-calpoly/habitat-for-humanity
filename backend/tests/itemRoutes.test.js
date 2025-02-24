const {
  Types: { ObjectId },
} = require("mongoose");
const request = require("supertest");
const mockingoose = require("mockingoose");
const Item = require("../models/itemSchema");
const app = require("../server");

describe("Item Routes", () => {
  const mockItemId = new ObjectId();
  const mockDonorId = "donor123";
  const validDate = new Date().toISOString();

  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe("GET Endpoints", () => {
    it("GET /api/items - should return all items", async () => {
      const mockItems = [
        {
          _id: mockItemId,
          name: "Chair",
          images: [],
          timeAvailability: [],
          size: "Large",
          address: "123 St",
          city: "City",
          zipCode: "12345",
          scheduling: "Flexible",
          donorId: mockDonorId,
          timeSubmitted: validDate,
          status: "Pending",
        },
      ];

      mockingoose(Item).toReturn(mockItems, "find");

      const res = await request(app).get("/api/items");
      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe("Chair");
    });

    it("GET /api/items/itemId/:itemId - should return item by ID", async () => {
      const mockItem = {
        _id: mockItemId,
        name: "Chair",
      };

      mockingoose(Item).toReturn(mockItem, "findOne");

      const res = await request(app).get(`/api/items/itemId/${mockItemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Chair");
    });
  });

  describe("POST Endpoints", () => {
    it("POST /api/items - should create new item", async () => {
      const validItem = {
        name: "Couch",
        images: [new ObjectId()],
        size: "Large",
        address: "123 St",
        city: "City",
        zipCode: "12345",
        scheduling: "Flexible",
        donorId: mockDonorId,
        timeSubmitted: validDate,
        status: "Pending",
      };

      mockingoose(Item).toReturn(validItem, "save");

      const res = await request(app).post("/api/items").send(validItem);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("PUT Endpoints", () => {
    it("PUT /api/items/itemId/:itemId - should update item", async () => {
      const existingItem = {
        _id: mockItemId,
        name: "Old Chair",
        size: "Large",
        address: "123 St",
        city: "City",
        zipCode: "12345",
        scheduling: "Flexible",
        donorId: mockDonorId,
        timeSubmitted: validDate,
        status: "Pending",
      };

      mockingoose(Item).toReturn(existingItem, "findOne");
      mockingoose(Item).toReturn(
        { ...existingItem, name: "New Chair" },
        "save"
      );

      const res = await request(app)
        .put(`/api/items/itemId/${mockItemId}`)
        .send({ name: "New Chair" });

      expect(res.statusCode).toBe(200);
    });
  });
});
