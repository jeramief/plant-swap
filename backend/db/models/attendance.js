("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Event, {
        foreignKey: "eventId",
      });
      Attendance.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
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
