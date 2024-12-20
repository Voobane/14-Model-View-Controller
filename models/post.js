const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {
  // Method to check if user is owner
  isOwner(userId) {
    return this.user_id === userId;
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "published",
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeUpdate: async (post) => {
        post.last_edited_at = new Date();
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
