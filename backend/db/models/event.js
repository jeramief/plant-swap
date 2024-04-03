"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
      });
      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
      });
      // Event.belongsToMany(models.User, {
      //   through: models.Attendance,
      //   foreignKey: "eventId",
      //   otherKey: "userId",
      // });
    }
  }
  Event.init(
    {
      venueId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      groupId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM("value", "otherValue"),,
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
