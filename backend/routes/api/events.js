const router = require("express").Router();
const {
  Event,
  Group,
  Venue,
  EventImage,
  Membership,
} = require("../../db/models");

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
/*-------------------------------GET-------------------------------*/

/*-------------------------------POST------------------------------*/

/*-------------------------------POST------------------------------*/

module.exports = router;
