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
          name: "Valid Data Group First Data Creation Event",
          type: "Online",
          capacity: 10,
          price: 18.5,
          description:
            "The first event creation for our group! Come say hello world!",
          startDate: "2030-11-22 20:00:00",
          endDate: "2030-11-22 21:00:00",
        },
        {
          groupId: 1,
          venueId: 2,
          name: "Valid Data Group Second Data Creation Event",
          type: "In person",
          capacity: 10,
          price: 18.5,
          description:
            "The second event creation for our group! Come say hello world again!",
          startDate: "2030-10-22 20:00:00",
          endDate: "2030-10-22 21:00:00",
        },
        {
          groupId: 3,
          venueId: 3,
          name: "Evening Tennis on the Water",
          type: "In Person",
          capacity: "10",
          price: 10.5,
          description:
            "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 2,
          venueId: 5,
          name: "Car Show",
          type: "In Person",
          capacity: "10",
          price: 10.5,
          description:
            "Show off your coolest ridesShow off your coolest ridesShow off your coolest rides.",
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-19 22:00:00",
        },
        {
          groupId: 2,
          venueId: 3,
          name: "Pool Party",
          type: "In Person",
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
