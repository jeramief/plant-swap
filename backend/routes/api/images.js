const router = require("express").Router();
const { GroupImage, EventImage, Group, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

/*-------------------------------DELETE----------------------------*/

// Delete an Image for a Group
router.delete("/group-images/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { imageId } = req.params;

  const groupImage = await GroupImage.findByPk(imageId, {
    include: Group,
  });

  if (!groupImage) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Group Image couldn't be found";

    return next(err);
  }

  const isCoHost = await groupImage.Group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (user.id !== groupImage.Group.organizerId && !isCoHost.length) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await groupImage.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

// Delete an Image for an Event
router.delete("/event-images/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { imageId } = req.params;

  const eventImage = await EventImage.findByPk(imageId);

  if (!eventImage) {
    const err = new Error();
    err.status = 404;
    err.title = "Not Found.";
    err.message = "Event Image couldn't be found";

    return next(err);
  }

  const event = await eventImage.getEvent({
    include: Group,
  });

  const isCoHost = await event.Group.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (user.id !== event.Group.organizerId && !isCoHost.length) {
    const err = new Error();
    err.title = "Forbidden";
    err.status = 403;
    err.message = "Forbiden";

    return next(err);
  }

  await eventImage.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

/*-------------------------------DELETE----------------------------*/

module.exports = router;
