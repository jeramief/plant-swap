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
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234817/41IkfFhdJTL_hcg9og.jpg",
    preview: true,
  },
  {
    groupId: 1,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234864/Attenborough-pitcher-plant-Philippines-native_ulvesn.jpg",
    preview: true,
  },
  {
    groupId: 3,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1714234790/5dd8732676db83be528e64137f9076c8_ucbfps.jpg",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://res.cloudinary.com/dammgkvnx/image/upload/v1685558128/misrjddjks1li6attzzi.jpg",
    preview: true,
  },
  {
    groupId: 4,
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
