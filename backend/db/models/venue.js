"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId",
        // as: "MainVenues",
      });
      Venue.belongsToMany(models.Group, {
        through: models.Event,
        foreignKey: "venueId",
        otherKey: "groupId",
      });
    }
  }
  Venue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      groupId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Venue",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return Venue;
};
