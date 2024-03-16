"use strict";

const { Venue } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const venues = [
  {
    groupId: 1,
    address: "123 Disney Lane",
    city: "New York",
    state: "NY",
    lat: 37.7645358,
    lng: -122.4730327,
  },
  {
    groupId: 2,
    address: "634 Code Street",
    city: "Indianapolis",
    state: "IN",
    lat: -37.7645358,
    lng: 122.4730327,
  },
  {
    groupId: 1,
    address: "444 Yellow Brick Road",
    city: "New York",
    state: "NY",
    lat: 34.4,
    lng: -124.4730327,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate(venues, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    return await queryInterface.bulkDelete(options, {
      address: venues.map((venue) => venue.address),
    });
  },
};
