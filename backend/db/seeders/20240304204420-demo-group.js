"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Evening Tennis on the Water",
          about:
            "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In person",
          private: true,
          city: "New York",
          state: "NY",
          numMembers: 10,
          previewImage: "image url",
        },
        {
          organizerId: 3,
          name: "Car Show",
          about:
            "Show off your coolest ridesShow off your coolest ridesShow off your coolest rides.",
          type: "In person",
          private: true,
          city: "Los Santos",
          state: "San Andreas",
          numMembers: 10,
          previewImage: "image url",
        },
        {
          organizerId: 1,
          name: "Pool Party",
          about:
            "Pool party, nothing too specialPool party, nothing too specialPool party, nothing too special.",
          type: "In person",
          private: true,
          city: "Las Venturas",
          state: "San Andreas",
          numMembers: 10,
          previewImage: "image url",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
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
