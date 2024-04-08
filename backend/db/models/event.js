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
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
      });
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
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
        // allowNull: false,
        type: DataTypes.DECIMAL(6, 2),
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
