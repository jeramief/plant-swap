const router = require("express").Router();
const { Op, where } = require("sequelize");
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
const {
  validateEvent,
  validateAttendance,
  validateQuery,
} = require("../../utils/validation");

/*-------------------------------GET-------------------------------*/
// Get all Events
router.get("/", validateQuery, async (req, res) => {
  let { page, size, name, type, startDate } = req.query;

  size = parseInt(size);
  page = parseInt(page);

  if (!page) page = 1;
  if (!size) size = 5;

  const where = {};
  const pagination = {
    limit: size,
    offset: size * (page - 1),
  };

  if (name) where.name = { [Op.like]: `%${name}%` };
  if (type) where.type = { [Op.like]: `%${type}%` };
  if (startDate) where.startDate = startDate;

  const eventsArr = [];

  const events = await Event.findAll({
    where,
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
    ...pagination,
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
      startDate: event.startDate.toString(),
      endDate: event.endDate.toString(),
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
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
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

  const eventImages = await event.getEventImages({
    attributes: ["id", "url", "preview"],
  });
  const numAttending = await Event.count({
    include: {
      model: Attendance,
      where: {
        eventId: event.id,
      },
    },
  });

  res.json({
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    price: event.price + "0",
    startDate: event.startDate,
    endDate: event.endDate,
    Group: event.Group,
    Venue: event.Venue,
    EventImages: eventImages,
    numAttending,
  });
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

// Add Image to Event based on Event id - route: /api/events/:eventId/images
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

  const group = await event.getGroup();
  const isCoHost = await event.getGroup({
    attributes: [],
    include: {
      model: Membership,
      where: { userId: user.id, status: "co-host" },
    },
  });
  const isAttendee = await event.getAttendances({
    where: { userId: user.id, status: "attending" },
  });

  if (user.id !== group.organizerId && !isCoHost && !isAttendee.length) {
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

// Request to Attend Event based on Event id - route: /api/events/:eventId/attendance
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

  const isMember = await event.getGroup({
    attributes: [],
    include: {
      model: Membership,
      where: { userId: user.id, status: { [Op.notLike]: "pending" } },
    },
  });
  const pendingAttendance = await Attendance.findAll({
    where: { eventId, userId: user.id, status: "pending" },
  });
  const acceptedAttendance = await Attendance.findAll({
    where: { eventId, userId: user.id, status: { [Op.notLike]: "pending" } },
  });

  if (!isMember) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }
  if (user.id === event.Group.organizerId || acceptedAttendance.length) {
    const err = new Error();
    err.status = 400;
    err.title = "Bad Request";
    err.message = "User is already an attendee of the event";

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

// Edit an Event specified by its id - route: /api/events/:eventId
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
    price: event.price + "0",
    description: event.description,
    startDate: event.startDate.toString(),
    endDate: event.endDate.toString(),
  });
});

// Change the status of an attendance for an event specified by id - route: /api/events/:eventId/attendance
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

// Delete attendance to an event specified by id
router.delete(
  "/:eventId/attendance/:userId",
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { eventId, userId } = req.params;

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
    const isAttendee = await Attendance.findOne({
      where: { userId: parseInt(userId), eventId },
    });

    if (!isUser) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "User couldn't be found";

      return next(err);
    }
    if (user.id !== event.Group.organizerId && user.id !== parseInt(userId)) {
      const err = new Error();
      err.title = "Forbidden";
      err.status = 403;
      err.message = "Forbiden";

      return next(err);
    }
    if (!isAttendee) {
      const err = new Error();
      err.status = 404;
      err.title = "Not Found.";
      err.message = "Attendance between the user and the event does not exist";

      return next(err);
    }
    const deleteAttendance = await Attendance.findOne({
      where: { userId, eventId },
    });

    await deleteAttendance.destroy();

    res.json({
      message: "Successfully deleted attendance from event",
    });
  }
);

/*-------------------------------DELETE----------------------------*/

module.exports = router;
