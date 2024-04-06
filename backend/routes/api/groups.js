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
  validateMembership,
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

  // const currentUser = await User.findByPk(user.id, {
  //   include: { model: Membership },
  // });
  const groupOrganizer = await Group.findAll({
    where: {
      organizerId: user.id,
    },
  });

  if (!groupOrganizer) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  // const userGroups = await currentUser.Memberships.getGroup();

  res.json({
    Groups: [...groupOrganizer /*...userGroups*/],
  });
});

// get Group details by id
router.get("/:groupId", async (req, res, next) => {
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
router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId, {
    include: [{ model: Venue, include: [] }],
  });

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

  if (!group) {
    const err = new Error();
    err.status = 404;
    // err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }
  if (user.id !== group.organizerId) {
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
  async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;

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

    console.log({ newGroupVenue });

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
// router.post(
//   "/:groupId/events",
//   requireAuth,
//   validateEvent,
//   async (req, res, next) => {
//     const { user } = req;
//     const { groupId } = req.params;
//     const {
//       venueId,
//       name,
//       type,
//       capacity,
//       price,
//       description,
//       startDate,
//       endDate,
//     } = req.body;

//     // const group = await Group.findOne({ id: parseInt(groupId) });
//     // const venue = await Venue.findOne({ id: parseInt(venueId) });
//     const group = await Group.findByPk(groupId);
//     const venue = await Venue.findByPk(venueId);

//     if (!group) {
//       const err = new Error();
//       err.status = 404;
//       err.title = "Not Found.";
//       err.message = "Group couldn't be found";

//       return next(err);
//     }
//     if (!venue) {
//       const err = new Error();
//       err.status = 404;
//       err.title = "Not Found.";
//       err.message = "Venue couldn't be found";

//       return next(err);
//     }

//     const isCoHost = await group.getMemberships({
//       where: { userId: user.id, status: "co-host" },
//     });

//     if (user.id !== group.organizerId && !isCoHost.length) {
//       const err = new Error();
//       err.title = "Forbidden";
//       err.status = 403;
//       err.message = "Forbiden";

//       return next(err);
//     }

//     const newGroupEvent = await Event.create({
//       groupId: group.id,
//       venueId: venue.id || null,
//       name,
//       type,
//       capacity,
//       price,
//       description,
//       startDate,
//       endDate,
//     });

//     console.log({ newGroupEvent, venue, group });

//     res.json(newGroupEvent);
//   }
// );
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res, next) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    let foundGroup = await Group.findOne({
      include: {
        model: Membership,
        include: {
          model: User,
          where: { id: user.id },
          required: false,
        },
        required: false,
      },
    });

    if (!foundGroup)
      return res.status(404).json({ message: "Group couldn't be found" });

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

    const foundVenue = await Venue.findOne();
    if (!foundVenue)
      return res.status(404).json({ message: "Venue couldn't be found" });

    foundGroup = foundGroup.toJSON();
    const isOrganizer = foundGroup.organizerId === user.id;
    let isCoHost = false;
    // if (foundGroup.Memberships.length > 0)
    // isCoHost = foundGroup.Memberships[0].Membership.status === "co-host";
    // if (!isOrganizer && !isCoHost) return next(new Error("Forbidden"));

    // if (!validateEventData(req, res)) return;

    const newEvent = await Event.create({
      groupId: parseInt(groupId),
      venueId: parseInt(venueId),
      name,
      type,
      capacity,
      price: parseFloat(price),
      description,
      startDate,
      endDate,
    });

    console.log({ newEvent });

    res.json({
      id: newEvent.id,
      groupId: newEvent.groupId,
      venueId: newEvent.venueId,
      name: newEvent.name,
      type: newEvent.type,
      capacity: newEvent.capacity,
      price: parseFloat(newEvent.price),
      description: newEvent.description,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
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
router.put("/:groupId", requireAuth, validateGroup, async (req, res, next) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId) {
    const err = new Error();
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

// Change the status of a membership for a group specified by id
router.put(
  "/:groupId/membership",
  requireAuth,
  validateMembership,
  async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params;
    const { memberId, status } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Group couldn't be found";

      return next(err);
    }

    const isUser = await User.findByPk(memberId);
    const isMember = await group.getMemberships({
      where: { userId: memberId },
    });

    if (user.id !== group.organizerId) {
      const err = new Error();
      err.title = "Forbidden";
      err.status = 403;
      err.message = "Forbiden";

      return next(err);
    }
    if (!isUser) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "User couldn't be found";

      return next(err);
    }
    if (!isMember.length) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Membership between the user and the group does not exist";

      return next(err);
    }

    const updateMembership = await Membership.findOne({
      where: { userId: memberId },
    });

    await updateMembership.update({ userId: memberId, status });

    res.json({ updateMembership });
  }
);

/*-------------------------------PUT-------------------------------*/

/*-------------------------------DELETE----------------------------*/

// Delete a Group
router.delete("/:groupId", requireAuth, async (req, res, next) => {
  const { user } = req;

  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group couldn't be found";

    return next(err);
  }

  if (user.id !== group.organizerId) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await group.destroy();

  return res.json({ message: "Successfully deleted" });
});

// Delete membership to a group specified by id
router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { groupId, memberId } = req.params;

    const group = await Group.findByPk(groupId);

    if (!group) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Group couldn't be found";

      return next(err);
    }

    const isUser = await User.findByPk(memberId);
    const isMember = await group.getMemberships({
      where: { userId: memberId },
    });

    if (!isUser) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "User couldn't be found";

      return next(err);
    }
    if (user.id !== group.organizerId && user.id !== isMember[0].userId) {
      const err = new Error();
      err.title = "Forbidden";
      err.status = 403;
      err.message = "Forbiden";

      return next(err);
    }
    if (!isMember.length) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Membership between the user and the group does not exist";

      return next(err);
    }

    await isMember[0].destroy();

    res.json({
      message: "Successfully deleted membership from group",
    });
  }
);

/*-------------------------------DELETE----------------------------*/

module.exports = router;
