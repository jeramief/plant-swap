"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "The Valid Data Group",
          about:
            "Enjoy several rounds of valid data being sent and stored in a database",
          type: "Online",
          private: true,
          city: "San Frangoodtogo",
          state: "CA",
        },
        {
          organizerId: 6,
          name: "Evening Tennis on the Water",
          about:
            "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In Person",
          private: true,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 8,
          name: "Car Show",
          about:
            "Show off your coolest ridesShow off your coolest ridesShow off your coolest rides.",
          type: "In Person",
          private: true,
          city: "Los Santos",
          state: "San Andreas",
        },
        {
          organizerId: 6,
          name: "Pool Party",
          about:
            "Pool party, nothing too specialPool party, nothing too specialPool party, nothing too special.",
          type: "In Person",
          private: true,
          city: "Las Venturas",
          state: "San Andreas",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
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
