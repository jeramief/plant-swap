const express = require("express");
const { check } = require("express-validator");

const { Group, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// get group - route /api/groups
router.get("/", async (req, res) => {
  // find all groups stored
  const groups = await Group.findAll();

  // return groups as json
  return res.json({
    Groups: groups,
  });
});

// get current user's groups - route: /api/groups/current
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const userGroups = await user.getGroups();
  const groupOrganizer = await Group.findAll({
    where: {
      organizerId: user.id,
    },
  });

  res.json({
    Groups: [...groupOrganizer, ...userGroups],
  });
});

module.exports = router;
