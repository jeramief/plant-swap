"use strict";

const { Op } = require("sequelize");
const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const members = [
  {
    userId: 2,
    groupId: 2,
    status: "co-host",
  },
  {
    userId: 2,
    groupId: 3,
    status: "co-host",
  },
  {
    userId: 1,
    groupId: 1,
    status: "member",
  },
  {
    userId: 3,
    groupId: 1,
    status: "pending",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(members, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return await queryInterface.bulkDelete(options, {
      userId: { [Op.or]: members.userId },
    });
  },
};
