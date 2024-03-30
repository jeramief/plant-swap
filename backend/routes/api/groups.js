const express = require("express");
const { check } = require("express-validator");

const {
  Group,
  Venue,
  User,
  GroupImage,
  Membership,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const handleValidationErrors = require("../../utils/validation");

const router = express.Router();

const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    // .custom((err) => err.status(400))
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

// get group - route /api/groups
router.get("/", async (req, res) => {
  // find all groups stored
  const groups = await Group.findAll({
    // include: ["Organizer"],
  });

  // return groups as json
  return res.json({
    Groups: groups,
  });
});

// get current user's groups - route: /api/groups/current
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const groupOrganizer = await Group.findAll({
    where: {
      organizerId: user.id,
    },
  });
  const userGroups = await user.getGroups({
    attributes: { exclude: [Membership] },
  });

  res.json({
    Groups: [...groupOrganizer, ...userGroups],
  });
});

// get Group details by id
router.get("/:groupId", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    attributes: { exclude: ["previewImage"] },
    include: [
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Organizer",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Venue,
        // as: "MainVenues",
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
        attributes: { exclude: ["Event"] },
      },
    ],
  });

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  return res.json(group);
});

// Get All Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId, {
    include: [{ model: Venue, include: [] }],
  });

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Not authorized",
    });
  }

  group = group.toJSON();
  console.log({ group });
  group.Venues.forEach((venue) => {
    delete venue.Event;
  });

  res.json({ Venues: group.Venues });
});

// create a group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const { user } = req;

  const newGroup = await Group.create({
    organizerId: user.id,
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

// add group image
router.post("/:groupId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;
  const { url, preview } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Only the Organizer of group can manage group",
    });
  }

  const newGroupImage = await GroupImage.create({
    groupId,
    url,
    preview,
  });

  res.json({
    id: newGroupImage.id,
    url: newGroupImage.url,
    preview: newGroupImage.preview,
  });
});

// create a new Venue for a Group specified by its id
router.post("/:groupId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;
  const { url, preview } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Only the Organizer of group can manage group",
    });
  }

  const newGroupImage = await GroupImage.create({
    groupId,
    url,
    preview,
  });

  res.json({
    id: newGroupImage.id,
    url: newGroupImage.url,
    preview: newGroupImage.preview,
  });
});

// edit a group
router.put("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;
  const group = await Group.findByPk(req.params.groupId);

  // checkForGroup(res, group);
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Only the Organizer of group can manage group",
    });
  }

  group.update({
    name,
    about,
    type,
    private,
    city,
    state,
  });

  res.json({
    id: group.id,
    organizerId: group.organizerId,
    name: group.name,
    about: group.about,
    type: group.type,
    private: group.private,
    city: group.city,
    state: group.state,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  });
});

router.delete("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  const group = await Group.findByPk(req.params.groupId);

  // checkForGroup(res, group);
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Only the Organizer of group can manage group",
    });
  }

  await group.destroy();

  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
