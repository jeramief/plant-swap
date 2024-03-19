"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Event, {
        foreignKey: {
          model: "Events",
          key: "id",
        },
      });
      Attendance.belongsTo(models.User, {
        foreignKey: {
          model: "Users",
          key: "id",
        },
      });
    }
  }
  Attendance.init(
    {
      eventId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM("value", "otherValue"),
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
