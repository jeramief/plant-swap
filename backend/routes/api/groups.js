const express = require("express");
// const { check } = require("express-validator");

const {
  Group,
  Venue,
  User,
  GroupImage,
  Membership,
  Event,
  EventImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateGroup, validateVenue } = require("../../utils/validation");

const router = express.Router();

/*-------------------------------GET-------------------------------*/

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
  group.Venues.forEach((venue) => {
    delete venue.Event;
  });

  res.json({ Venues: group.Venues });
});

// Get all Events of a Group specified by its id
router.get("/:groupId/events", async (req, res, next) => {
  const { groupId } = req.params;

  const eventsArr = [];

  const groupEvents = await Group.findByPk(groupId, {
    attributes: [],
    include: {
      model: Event,
      attributes: [
        "id",
        "groupId",
        "venueId",
        "name",
        "type",
        "startDate",
        "endDate",
      ],
      include: [
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
      ],
    },
  });

  if (!groupEvents) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  for (const event of groupEvents.Events) {
    const imageUrl = await EventImage.findOne({
      where: {
        eventId: event.id,
      },
      attributes: ["url"],
    });
    const numAttending = await Group.count({
      include: {
        model: Membership,
        where: {
          groupId: event.groupId,
        },
      },
    });

    if (!imageUrl) {
      event.dataValues.previewImage = null;
    } else {
      event.previewImage = imageUrl.url;
    }

    const payload = {
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue,
    };

    eventsArr.push(payload);
  }

  return res.json({ Events: eventsArr });
});
/*-------------------------------GET-------------------------------*/

/*-------------------------------POST------------------------------*/

// create a group
router.post("/", [requireAuth, validateGroup], async (req, res) => {
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
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res) => {
    const { user } = req;
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findByPk(groupId);
    const isCoHost = await group.getMemberships({
      where: { userId: user.id, status: "co-host" },
    });

    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
      });
    }

    if (user.id !== group.organizerId && !isCoHost.length) {
      return res.status(400).json({
        message: "Only the Organizer or co-host of the group can manage group",
      });
    }

    const newGroupVenue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    });

    res.json({
      id: newGroupVenue.id,
      groupId: newGroupVenue.groupId,
      address: newGroupVenue.address,
      city: newGroupVenue.city,
      state: newGroupVenue.state,
      lat: newGroupVenue.lat,
      lng: newGroupVenue.lng,
    });
  }
);

/*-------------------------------POST------------------------------*/

/*-------------------------------PUT-------------------------------*/

// edit a group
router.put("/:groupId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;
  const group = await Group.findByPk(req.params.groupId);

  // checkForGroup(res, group);
  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
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

/*-------------------------------PUT-------------------------------*/

/*-------------------------------DELETE----------------------------*/

router.delete("/:groupId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const group = await Group.findByPk(req.params.groupId);

  // checkForGroup(res, group);
  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId) {
    return res.status(400).json({
      message: "Only the Organizer of group can manage group",
    });
  }

  await group.destroy();

  return res.json({ message: "Successfully deleted" });
});

/*-------------------------------DELETE----------------------------*/

module.exports = router;
