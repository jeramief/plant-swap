"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "Organizer",
      });
      // Group.hasMany(models.GroupImage, {
      //   foreignKey: "groupId",
      // });
      // Group.hasMany(models.Venue, {
      //   foreignKey: "groupId",
      //   as: "MainVenues",
      // });
      // Group.belongsToMany(models.User, {
      //   through: models.Membership,
      //   foreignKey: "groupId",
      //   otherKey: "userId",
      // });
      // Group.belongsToMany(models.Venue, {
      //   through: models.Event,
      //   foreignKey: "groupId",
      //   otherKey: "venueId",
      // });
      // Group.hasMany(models.Membership, {
      //   foreignKey: "groupId",
      // });
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
        validate: {
          len: [1, 60],
        },
      },
      about: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [50],
        },
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
      numMembers: {
        type: DataTypes.INTEGER,
      },
      previewImage: {
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
