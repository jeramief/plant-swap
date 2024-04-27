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
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 4,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 5,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
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
