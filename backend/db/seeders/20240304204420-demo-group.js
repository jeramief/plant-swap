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
          name: "Pothos Group",
          about:
            "We enjoy pothos, and would like to share our hobby with others!",
          type: "In Person",
          private: false,
          city: "San Frangoodtogo",
          state: "CA",
        },
        {
          organizerId: 6,
          name: "Pitcher Plant Group",
          about:
            "We enjoy pitcher plants, and would like to share our hobby with others!",
          type: "In Person",
          private: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 8,
          name: "Hosta Group",
          about:
            "We enjoy hosta, and would like to share our hobby with others!",
          type: "In Person",
          private: false,
          city: "Los Santos",
          state: "SA",
        },
        {
          organizerId: 6,
          name: "Online Plants",
          about: "We enjoy plants, and we deliver!",
          type: "Online",
          private: true,
          city: "Online",
          state: "ON",
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
