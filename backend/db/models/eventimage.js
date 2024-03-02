"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, {
        foreignKey: {
          model: "Events",
          key: "id",
        },
      });
    }
  }
  EventImage.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );
  return EventImage;
};
