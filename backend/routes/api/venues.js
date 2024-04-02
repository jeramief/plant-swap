const express = require("express");

const { Group, Venue, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateVenue } = require("../../utils/validation");

const router = express.Router();

// Edit a Venue specified by its id
router.put("/:venueId", requireAuth, validateVenue, async (req, res) => {
  const { user } = req;
  const { venueId } = req.params;
  const { address, city, state, lat, lng } = req.body;

  const venue = await Venue.findByPk(venueId, {
    include: { model: Group, as: "MainVenues" },
  });

  if (!venue) {
    return res.status(404).json({
      message: "Venue couldn't be found",
    });
  }

  const isCoHost = await venue.MainVenues.getMemberships({
    where: { userId: user.id, status: "co-host" },
  });

  if (user.id !== venue.MainVenues.organizerId && !isCoHost.length) {
    return res.status(400).json({
      message: "Only the Organizer or co-host of the group can manage group",
    });
  }

  const updateVenue = await venue.update({
    address,
    city,
    state,
    lat,
    lng,
  });

  res.json({
    id: updateVenue.id,
    groupId: updateVenue.groupId,
    address: updateVenue.address,
    city: updateVenue.city,
    state: updateVenue.state,
    lat: updateVenue.lat,
    lng: updateVenue.lng,
  });
});

module.exports = router;
