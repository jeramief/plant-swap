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
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234815/Jade-Pothos-1G-HB-Variation-800x1000_iquymy.jpg",
    preview: true,
  },
  {
    eventId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234717/iu_f9nf8m.jpg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234789/dc2ef20a0b39ffed6acdc2b6b9d3fa7e_kt9qyk.jpg",
    preview: true,
  },
  {
    eventId: 4,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234864/detailSSP_276215_esahz8.jpg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    eventId: 5,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714235968/iu_zt9lbj.jpg",
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
