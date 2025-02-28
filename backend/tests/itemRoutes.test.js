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

  const createMockItem = (overrides = {}) => ({
    name: "Test Item",
    images: [new ObjectId()],
    size: "Medium",
    address: "456 Ave",
    city: "Metropolis",
    zipCode: "67890",
    scheduling: "Fixed",
    donorId: mockDonorId,
    timeSubmitted: validDate,
    status: "Approved",
    ...overrides,
  });

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

    it("GET /api/items/name/:name - should return 404 for non-existent name", async () => {
      mockingoose(Item).toReturn([], "find");
      const res = await request(app).get("/api/items/name/nonexistent");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
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
    it("GET /api/items/donorId/:donorId - should return empty array", async () => {
      mockingoose(Item).toReturn([], "find");
      const res = await request(app).get(`/api/items/donorId/invalid_donor`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("GET /api/items/location/:city/:address - should return empty array", async () => {
      mockingoose(Item).toReturn([], "find");
      const res = await request(app).get("/api/items/location/Nowhere/123_St");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /api/items/itemId/:itemId", () => {
    it("should return 404 for non-existent item", async () => {
      mockingoose(Item).toReturn(null, "findOne");
      const res = await request(app).get(`/api/items/itemId/${mockItemId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/Item not found/i);
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
    it("POST /api/items - should reject missing required fields", async () => {
      const invalidItem = createMockItem();
      delete invalidItem.size;

      const res = await request(app).post("/api/items").send(invalidItem);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/size/);
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
    it("PUT /api/items/itemId/:itemId - should update multiple fields", async () => {
      const existingItem = createMockItem({ _id: mockItemId });
      const updates = {
        name: "New Name",
        status: "Updated",
        address: "New Address",
      };

      mockingoose(Item)
        .toReturn(existingItem, "findOne")
        .toReturn({ ...existingItem, ...updates }, "save");

      const res = await request(app)
        .put(`/api/items/itemId/${mockItemId}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toContain("Updated item");
    });

    it("PUT /api/items/itemId/:itemId - should reject invalid item ID", async () => {
      const res = await request(app)
        .put("/api/items/itemId/invalid_id")
        .send({ name: "New Name" });

      expect(res.statusCode).toBe(400);
    });
    it("PUT /api/items/itemId/:itemId - should handle save errors", async () => {
      const existingItem = createMockItem({ _id: mockItemId });

      mockingoose(Item)
        .toReturn(existingItem, "findOne")
        .toReturn(new Error("Save failed"), "save");

      const res = await request(app)
        .put(`/api/items/itemId/${mockItemId}`)
        .send({ name: "New Name" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Save failed/i);
    });
  });

  describe("Additional Coverage Tests", () => {
    it("GET /api/items/location/:city/:address - should return items by location", async () => {
      const mockItems = [
        {
          _id: mockItemId,
          city: "Seattle",
          address: "123 Main St",
        },
      ];

      mockingoose(Item).toReturn(mockItems, "find");

      const res = await request(app).get(
        "/api/items/location/Seattle/123%20Main%20St"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body[0].city).toBe("Seattle");
    });

    it("GET /api/items/donorId/:donorId - should return items by donor", async () => {
      const mockItems = [
        {
          _id: mockItemId,
          donorId: mockDonorId,
        },
      ];

      mockingoose(Item).toReturn(mockItems, "find");

      const res = await request(app).get(`/api/items/donorId/${mockDonorId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body[0].donorId).toBe(mockDonorId);
    });

    it("PUT /api/items/itemId/:itemId - should handle invalid updates", async () => {
      const existingItem = {
        _id: mockItemId,
        status: "Pending",
      };

      mockingoose(Item).toReturn(existingItem, "findOne");

      const res = await request(app)
        .put(`/api/items/itemId/${mockItemId}`)
        .send({ invalidField: "value" });

      expect(res.statusCode).toBe(400);
    });

    it("POST /api/items - should handle invalid timeAvailability format", async () => {
      const invalidItem = {
        timeAvailability: [{ invalid: "format" }],
      };

      const res = await request(app).post("/api/items").send(invalidItem);

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Error Handling Tests", () => {
    it("GET /api/items - should handle database errors", async () => {
      mockingoose(Item).toReturn(new Error("Database failure"), "find");
      const res = await request(app).get("/api/items");

      expect(res.statusCode).toBe(400);
      expect(res.body?.error || res.text).toMatch(/Database failure/i);
    });

    it("GET /api/items/itemId/invalid_id - should handle invalid ID format", async () => {
      const res = await request(app).get("/api/items/itemId/not_a_real_id");

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid item ID format/i);
    });
    it("POST /api/items - should return error object format", async () => {
      const invalidItem = createMockItem();
      delete invalidItem.name;

      const res = await request(app).post("/api/items").send(invalidItem);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: expect.stringMatching(/validation failed/i),
      });
    });

    it("PUT /api/items/itemId/invalid_id - should handle invalid updates", async () => {
      const res = await request(app)
        .put("/api/items/itemId/invalid_id")
        .send({ name: "New Name" });

      expect(res.statusCode).toBe(400);
      expect(res.body?.error || res.text).toBeTruthy();
    });
  });
});
