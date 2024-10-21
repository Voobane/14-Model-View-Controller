const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
  {
    // Primary key for the comment
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // The content of the comment
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Foreign key referencing the associated post
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "post",
        key: "id",
      },
    },
    // Foreign key referencing the user who made the comment
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  }
);

module.exports = Comment;
