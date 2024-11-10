const User = require("./user");
const Post = require("./post");
const Comment = require("./Comment");

// User-Post Associations
User.hasMany(Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

// User-Comment Associations
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

// Post-Comment Associations
Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

// Export models
module.exports = {
  User,
  Post,
  Comment,
};
