"use strict";

const { Op } = require("sequelize");
const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const eventImages = [
  {
    eventId: 1,
    url: "image url",
    preview: true,
  },
  {
    eventId: 2,
    url: "image url",
    preview: true,
  },
  {
    eventId: 1,
    url: "image url",
    preview: false,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(eventImages, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return await queryInterface.bulkDelete(options, {
      // url: { [Op.or]: eventImages.url },
    });
  },
};
