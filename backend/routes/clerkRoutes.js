const express = require("express");
const router = express.Router();
const { users } = require("@clerk/clerk-sdk-node");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await users.getUser(userId);
    const { firstName, lastName, emailAddresses } = user;

    res.status(200).json({
      firstName,
      lastName,
      email: emailAddresses[0]?.emailAddress || "",
    });
  } catch (err) {
    console.error("[CLERK_FETCH_ERROR]", err);
    res.status(500).json({ error: "Failed to fetch Clerk user" });
  }
});

module.exports = router;
