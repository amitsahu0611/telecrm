/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const ServiceCategory = sequelize.define(
  "ServiceCategory",
  {
    service_category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "serviceCategory",
    timestamps: true,
  }
);

module.exports = ServiceCategory;
