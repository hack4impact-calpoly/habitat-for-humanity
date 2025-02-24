const mongoose = require('mongoose');
const Item = require('./models/itemSchema');
const { itemConnection } = require('./connection'); // Ensure this path is correct

async function testSchema() {
  try {
    // Connect using the existing connection
    await itemConnection.asPromise(); // Wait for connection if not already ready

    // Test valid case
    const validItem = new Item({
      name: ["Chair", "Table"],
      size: ["Medium", "Large"],
      images: [new mongoose.Types.ObjectId()],
      address: "123 Main St",
      city: "Springfield",
      zipCode: "12345",
      scheduling: "ASAP",
      donorId: "donor_123",
      timeSubmitted: new Date(),
      status: "pending"
    });

    const savedItem = await validItem.save();
    console.log('✅ Valid test passed:', savedItem);

    // Test invalid case
    try {
      const invalidItem = new Item({
        name: ["Couch"],
        size: ["Large", "XL"], // Mismatched lengths
        images: [new mongoose.Types.ObjectId()],
        address: "456 Oak St",
        city: "Shelbyville",
        zipCode: "67890",
        scheduling: "Flexible",
        donorId: "donor_456",
        timeSubmitted: new Date(),
        status: "approved"
      });
      
      await invalidItem.save();
      console.error('❌ Invalid test failed');
    } catch (error) {
      console.log('✅ Invalid test passed:', error.message);
    }

    // Cleanup
    await Item.deleteMany({});
    await itemConnection.close();

  } catch (error) {
    console.error('🚨 Test failed:', error);
    process.exit(1);
  }
}

testSchema();