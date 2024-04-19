"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "FirstTest",
          lastName: "AATester",
          email: "first.test@gmail.com",
          username: "firstaatester",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Tabia",
          lastName: "Ye",
          email: "second.test@gmail.com",
          username: "OrangeTabia",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "ThirdTest",
          lastName: "AATester",
          email: "third.test@gmail.com",
          username: "thirdaatester",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "FourthTest",
          lastName: "AATester",
          email: "fourth.test@gmail.com",
          username: "fourthaatester",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "FifthTest",
          lastName: "AATester",
          email: "fifth.test@gmail.com",
          username: "fifthaatester",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Fake",
          lastName: "User",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Faker",
          lastName: "User",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options
      // {
      //   username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      // },
      // {}
    );
  },
};
