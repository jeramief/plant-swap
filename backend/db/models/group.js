"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
      });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
      });
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
      });
      Group.belongsToMany(models.Venue, {
        through: models.Event,
        foreignKey: "groupId",
        otherKey: "venueId",
      });
    }
  }
  Group.init(
    {
      organizerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      about: {
        allowNull: false,
        type: DataTypes.BLOB,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM("value", "otherValue"),,
      },
      private: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
