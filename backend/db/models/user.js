"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Group, {
        foreignKey: "organizerId",
        as: "Organizer",
      });
      // User.belongsToMany(models.Attendance, {
      //   through: models.Attendance,
      //   foreignKey: "userId",
      //   otherKey: "eventId",
      // });
      // User.belongsToMany(models.Group, {
      //   through: models.Membership,
      //   foreignKey: "userId",
      //   otherKey: "groupId",
      // });
      User.hasMany(models.Membership, {
        foreignKey: "userId",
      });
      User.hasMany(models.Attendance, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "User already exists",
          msg: "User with that username already exists",
        },
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          message: "User already exists",
          msg: "User with that email already exists",
        },
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
    }
  );
  return User;
};
