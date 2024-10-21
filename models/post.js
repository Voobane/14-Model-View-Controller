const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
  {
    // Primary key for the post
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // The title of the post
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The content of the post
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Foreign key referencing the user who created the post
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user", // Referencing the User model
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
