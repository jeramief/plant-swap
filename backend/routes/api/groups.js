const express = require("express");
const { check } = require("express-validator");

const { Group, Venue } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { json } = require("sequelize");

const router = express.Router();

// get group - route /api/groups
router.get("/", async (req, res) => {
  // find all groups stored
  const groups = await Group.findAll({
    include: ["Organizer"],
  });

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

// get Group details by id
router.get("/:groupId", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: ["GroupImages", "Organizer", "Venues"],
  });
  //   const groupVenues = await Group.getMainVenues;
  //   console.log(groupVenues);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  return res.json(group);
});

module.exports = router;
