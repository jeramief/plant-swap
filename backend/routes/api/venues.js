const express = require("express");

const { Group, Venue, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const handleValidationErrors = require("../../utils/validation");

const router = express.Router();

// router.post("/:groupId/venues", requireAuth, async (req, res) => {
//   res.json({ hello: "world" });
// });
