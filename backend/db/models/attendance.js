"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
        type: DataTypes.ENUM("value", "otherValue"),
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
