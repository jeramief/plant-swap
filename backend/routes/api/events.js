const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Event,
  Group,
  Venue,
  EventImage,
  Membership,
  Attendance,
  User,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateEvent, validateAttendance } = require("../../utils/validation");

/*-------------------------------GET-------------------------------*/
// Get all Events
router.get("/", async (req, res) => {
  const eventsArr = [];

  const events = await Event.findAll({
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
  });

  for (const event of events) {
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

// Get details of an Event specified by its id
router.get("/:eventId", async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "description",
      "type",
      "capacity",
      "price",
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
      // {
      //   model: "EventImages",
      //   attributes: ["id", "url", "preview"],
      // },
    ],
  });

  if (!event) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }

  const eventImages = await event.getEventImages();
  const numAttending = await Group.count({
    include: {
      model: Membership,
      where: {
        groupId: event.groupId,
      },
    },
  });

  res.json({ event: { event, EventImages: eventImages, numAttending } });
});

// Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res, next) => {
  const { user } = req;
  const { eventId } = req.params;

  const group = await Event.findByPk(eventId, {
    attributes: [],
    include: {
      model: Group,
    },
  });

  if (!group) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }

  const isCoHost = await group.Group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (user.id == group.Group.organizerId || isCoHost.length) {
    const attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        attributes: ["status"],
        where: {
          eventId,
        },
      },
    });

    return res.json({ Attendees: attendees });
  } else {
    const attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        attributes: ["status"],
        where: {
          eventId,
          status: { [Op.notLike]: "pending" },
        },
      },
    });

    return res.json({ Members: attendees });
  }
});

/*-------------------------------GET-------------------------------*/

/*-------------------------------POST------------------------------*/

// Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { eventId } = req.params;
  const { url, preview } = req.body;

  const event = await Event.findByPk(eventId);

  if (!event) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }

  const isMember = await event.getGroup({
    attributes: [],
    include: { model: Membership, where: { userId: user.id } },
  });

  console.log({ isMember });

  if (user.id !== event.organizerId && !isMember) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  const newEventImage = await EventImage.create({
    eventId,
    url,
    preview,
  });

  res.json({
    id: newEventImage.id,
    url: newEventImage.url,
    preview: newEventImage.preview,
  });
});

// Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId, {
    include: Group,
  });

  if (!event) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }

  const pendingAttendance = await Attendance.findAll({
    where: { eventId, userId: user.id, status: "pending" },
  });
  const acceptedAttendance = await Attendance.findAll({
    where: { eventId, userId: user.id, status: { [Op.notLike]: "pending" } },
  });

  if (user.id === event.Group.organizerId || acceptedAttendance.length) {
    const err = new Error();
    err.status = 400;
    err.title = "Bad Request";
    err.message = "User is already a member of the event";

    return next(err);
  }
  if (pendingAttendance.length) {
    const err = new Error();
    err.status = 400;
    err.title = "Bad Request";
    err.message = "Attendance has already been requested";

    return next(err);
  }

  const newAttendance = await Attendance.create({
    userId: user.id,
    eventId,
    status: "pending",
  });

  return res.json({
    userId: newAttendance.userId,
    status: newAttendance.status,
  });
});

/*-------------------------------POST------------------------------*/

/*-------------------------------PUT-------------------------------*/

// Edit an Event specified by its id
router.put("/:eventId", requireAuth, validateEvent, async (req, res, next) => {
  const { user } = req;
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

  const event = await Event.findByPk(req.params.eventId);
  const venue = await Venue.findByPk(venueId);

  if (!event) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }
  if (!venue) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Venue couldn't be found";

    return next(err);
  }

  const isOrganizer = await event.getGroup({
    where: { organizerId: user.id },
  });
  const isCoHost = await event.getGroup({
    attributes: [],
    include: {
      model: Membership,
      where: { userId: user.id, status: "co-host" },
    },
  });

  if (!isOrganizer && !isCoHost) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await event.update({
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
    id: event.id,
    groupId: event.groupId,
    venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
  });
});

// Change the status of an attendance for an event specified by id
router.put(
  "/:eventId/attendance",
  requireAuth,
  validateAttendance,
  async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;
    const { userId, status } = req.body;

    const event = await Event.findByPk(eventId, {
      include: Group,
    });

    if (!event) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Event couldn't be found";

      return next(err);
    }

    const isUser = await User.findByPk(userId);
    const isCoHost = await event.Group.getMemberships({
      where: { userId: user.id, status: "co-host" },
    });
    const isMember = await event.Group.getMemberships({
      where: { userId: userId },
    });

    if (user.id !== event.Group.organizerId && !isCoHost.length) {
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
      err.message = "Attendance between the user and the event does not exist";

      return next(err);
    }
    console.log({ cohost: isCoHost[0], organizer: event.Group.organizerId });
    const updateAttendance = await Attendance.findOne({
      where: { userId, eventId },
    });

    await updateAttendance.update({
      status,
    });

    res.json({
      id: updateAttendance.id,
      eventId: updateAttendance.eventId,
      userId: updateAttendance.userId,
      status: updateAttendance.status,
    });
  }
);

/*-------------------------------PUT-------------------------------*/

/*-------------------------------DELETE----------------------------*/

// Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async (req, res, next) => {
  const { user } = req;

  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event couldn't be found";

    return next(err);
  }

  const isOrganizer = await event.getGroup({
    where: { organizerId: user.id },
  });
  const isCoHost = await event.getGroup({
    attributes: [],
    include: {
      model: Membership,
      where: { userId: user.id, status: "co-host" },
    },
  });

  if (!isOrganizer && !isCoHost) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await event.destroy();

  return res.json({ message: "Successfully deleted" });
});

/*-------------------------------DELETE----------------------------*/

module.exports = router;
