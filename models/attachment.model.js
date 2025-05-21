/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const Attachment = sequelize.define(
  "Attachment",
  {
    attachment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("text", "image", "file", "link", "other"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "attachments",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Attachment;
