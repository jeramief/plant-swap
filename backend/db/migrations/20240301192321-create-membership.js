"use strict";

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Memberships",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
        },
        groupId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING, // ENUM("value", "otherValue"),,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return queryInterface.dropTable(options);
  },
};
