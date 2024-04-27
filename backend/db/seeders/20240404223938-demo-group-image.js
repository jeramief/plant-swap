"use strict";

const { Op } = require("sequelize");
const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const groupImages = [
  {
    groupId: 1,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1677039833/tfzkbkqxctw8mslnchye.png",
    preview: true,
  },
  {
    groupId: 1,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1677039833/tfzkbkqxctw8mslnchye.png",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1677039833/tfzkbkqxctw8mslnchye.png",
    preview: true,
  },
  {
    groupId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1677039833/tfzkbkqxctw8mslnchye.png",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1677039833/tfzkbkqxctw8mslnchye.png",
    preview: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(groupImages, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    return await queryInterface.bulkDelete(options, {
      // url: { [Op.or]: groupImages.url },
    });
  },
};
