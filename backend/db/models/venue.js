"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId",
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
      groupId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lon: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );
  return Venue;
};
