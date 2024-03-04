const express = require("express");
const { check } = require("express-validator");

const { Group, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// get group - route /api/groups
router.get("/", async (req, res) => {
  // find all groups stored
  const groups = await Group.findAll({
    include: {
      model: User,
      as: "Organizer",
    },
  });

  // return groups as json
  return res.json({
    Groups: groups,
  });
});

// get current user's groups - route: /api/groups/current
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  console.log({ userGroups: user.getGroups });

  res.json();
});

module.exports = router;
