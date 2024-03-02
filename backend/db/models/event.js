"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImages, {
        foreignKey: "eventId",
      });
      Event.belongsToMany(models.Users, {
        through: models.Attendances,
        foreignKey: "eventId",
        otherKey: "userId",
      });
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
        type: DataTypes.BLOB,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
