const express = require("express");
const { Op } = require("sequelize");

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
const {
  validateGroup,
  validateVenue,
  validateEvent,
} = require("../../utils/validation");

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
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
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
  const isCoHost = await group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId && !isCoHost.length) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbidden";

    return next(err);
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

// Get all Members of a Group specified by its id
router.get("/:groupId/members", async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  const isCoHost = await group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (user.id === group.organizerId || isCoHost.length) {
    const members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        attributes: ["status"],
        where: {
          groupId,
        },
      },
    });

    return res.json({ Members: members });
  } else {
    const members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        attributes: ["status"],
        where: {
          groupId,
          status: { [Op.notLike]: "pending" },
        },
      },
    });

    return res.json({ Members: members });
  }
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
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;
  const { url, preview } = req.body;

  const group = await Group.findByPk(groupId);
  const isCoHost = await group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId && !isCoHost.length) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
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
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Group couldn't be found";

      return next(err);
    }

    if (user.id !== group.organizerId && !isCoHost.length) {
      const err = new Error();
      err.title = "Forbidden";
      err.status = 403;
      err.message = "Forbiden";

      return next(err);
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
      groupId: parseInt(groupId),
      address: newGroupVenue.address,
      city: newGroupVenue.city,
      state: newGroupVenue.state,
      lat: newGroupVenue.lat,
      lng: newGroupVenue.lng,
    });
  }
);

// Create an Event for a Group specified by its id
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res, next) => {
    const { user } = req;
    let { groupId } = req.params;
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const group = await Group.findByPk(groupId);
    const venue = await Venue.findByPk(venueId);

    if (!group) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Group couldn't be found";

      return next(err);
    }
    if (!venue) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Venue couldn't be found";

      return next(err);
    }

    const isCoHost = await group.getMemberships({
      where: { userId: user.id, status: "co-host" },
    });

    if (user.id !== group.organizerId && !isCoHost.length) {
      err.title = "Forbidden";
      err.status = 403;
      err.message = "Forbiden";

      return next(err);
    }

    const newGroupEvent = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    res.json({
      id: newGroupEvent.id,
      groupId: parseInt(groupId),
      venueId,
      name: newGroupEvent.name,
      type: newGroupEvent.type,
      capacity: newGroupEvent.capacity,
      price: newGroupEvent.price,
      description: newGroupEvent.description,
      startDate: newGroupEvent.startDate,
      endDate: newGroupEvent.endDate,
    });
  }
);

// Request a Membership for a Group based on the Group's id
router.post("/:groupId/membership", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  const pendingMembership = await group.getMemberships({
    where: { userId: user.id, status: "pending" },
  });
  const acceptedMembership = await group.getMemberships({
    where: { userId: user.id, status: { [Op.notLike]: "pending" } },
  });

  if (user.id === group.organizerId || acceptedMembership.length) {
    const err = new Error();
    err.status = 400;
    err.title = "Bad Request";
    err.message = "User is already a member of the group";

    return next(err);
  }
  if (pendingMembership.length) {
    const err = new Error();
    err.status = 400;
    err.title = "Bad Request";
    err.message = "Membership has already been requested";

    return next(err);
  }

  const newMember = await Membership.create({
    userId: user.id,
    groupId,
    status: "pending",
  });

  return res.json({
    memberId: newMember.userId,
    status: newMember.status,
  });
});

/*-------------------------------POST------------------------------*/

/*-------------------------------PUT-------------------------------*/

// edit a group
router.put("/:groupId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.findByPk(req.params.groupId);
  const isCoHost = await group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  // checkForGroup(res, group);
  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId && !isCoHost.length) {
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
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
  const isCoHost = await group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  // checkForGroup(res, group);
  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId && !isCoHost.length) {
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await group.destroy();

  return res.json({ message: "Successfully deleted" });
});

/*-------------------------------DELETE----------------------------*/

module.exports = router;
