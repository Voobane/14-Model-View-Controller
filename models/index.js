// models/index.js
const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");

// User-Post relationship: A user can have many posts
User.hasMany(Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// User-Comment relationship: A user can have many comments
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// Post belongs to a user
Post.belongsTo(User, {
  foreignKey: "user_id",
});

// Comment belongs to a user
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

// Post has many comments
Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

// Comment belongs to a post
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

module.exports = { User, Post, Comment };
