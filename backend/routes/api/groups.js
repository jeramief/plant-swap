const express = require("express");
const { check } = require("express-validator");

const { Group, Venue } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const handleValidationErrors = require("../../utils/validation");

const router = express.Router();

const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("name").trim().notEmpty().withMessage("Group name cannot be empty"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  handleValidationErrors,
];

// handle errors
// router.use(validateGroup);

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

// create a group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const { user } = req;

  const newGroup = await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
  });

  return res.status(201).json({
    id: newGroup.id,
    organizerId: user.id,
    name: newGroup.name,
    about: newGroup.about,
    type: newGroup.type,
    private: newGroup.private,
    city: newGroup.city,
    state: newGroup.state,
    createdAt: newGroup.createdAt,
    updatedAt: newGroup.updatedAt,
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
