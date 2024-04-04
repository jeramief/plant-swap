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
    url: "image url",
    preview: true,
  },
  {
    groupId: 2,
    url: "image url",
    preview: true,
  },
  {
    groupId: 1,
    url: "image url",
    preview: false,
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
      url: { [Op.or]: groupImages.url },
    });
  },
};
