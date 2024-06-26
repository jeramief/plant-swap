"use strict";

const { Op } = require("sequelize");
const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const attendances = [
  {
    eventId: 1,
    userId: 2,
    status: "attending",
  },
  {
    eventId: 2,
    userId: 3,
    status: "attending",
  },
  {
    eventId: 3,
    userId: 6,
    status: "attending",
  },
  {
    eventId: 5,
    userId: 7,
    status: "waitlist",
  },
  {
    eventId: 3,
    userId: 8,
    status: "pending",
  },
  {
    eventId: 5,
    userId: 8,
    status: "pending",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(attendances, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    return await queryInterface.bulkDelete(options, {
      // userId: { [Op.or]: attendances.userId },
    });
  },
};
