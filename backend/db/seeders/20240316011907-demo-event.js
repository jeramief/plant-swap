"use strict";

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          groupId: 1,
          venueId: 1,
          name: "Pothos Swap",
          type: "In Person",
          capacity: 10,
          price: 3,
          description: "We are trading pothos at this event!",
          startDate: "2030-11-22 20:00:00",
          endDate: "2030-11-22 21:00:00",
        },
        {
          groupId: 1,
          venueId: 2,
          name: "Not Only Pothos Swap",
          type: "Online",
          capacity: 10,
          price: 3,
          description: "We are trading not only pothos at this event!",
          startDate: "2030-10-22 20:00:00",
          endDate: "2030-10-22 21:00:00",
        },
        {
          groupId: 3,
          venueId: 3,
          name: "Hosta Swap",
          type: "In Person",
          capacity: "10",
          price: 2,
          description: "We are trading hostas at this event!",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 2,
          venueId: 5,
          name: "Pitcher Plant Swap",
          type: "In Person",
          capacity: "10",
          price: 1,
          description: "We are trading pitcher plants at this event!",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 2,
          venueId: 3,
          name: "Not Only Pitcher Plant Swap",
          type: "In Person",
          capacity: "10",
          price: 1,
          description: "We are trading pitcher plants at this event!",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options
      // {
      //   name: {
      //     [Op.in]: ["Evening Tennis on the Water", "Car Show", "Pool Party"],
      //   },
      // },
      // {}
    );
  },
};
