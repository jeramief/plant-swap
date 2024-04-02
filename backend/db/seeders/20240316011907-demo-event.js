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
          groupId: 2,
          venueId: 1,
          name: "Evening Tennis on the Water",
          type: "In person",
          capacity: "10",
          price: 10.5,
          description:
            "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 1,
          venueId: 3,
          name: "Car Show",
          type: "In person",
          capacity: "10",
          price: 10.5,
          description:
            "Show off your coolest ridesShow off your coolest ridesShow off your coolest rides.",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 1,
          venueId: 1,
          name: "Pool Party",
          type: "In person",
          capacity: "10",
          price: 10.5,
          description:
            "Pool party, nothing too specialPool party, nothing too specialPool party, nothing too special.",
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
      options,
      {
        name: {
          [Op.in]: ["Evening Tennis on the Water", "Car Show", "Pool Party"],
        },
      },
      {}
    );
  },
};
