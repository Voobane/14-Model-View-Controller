const User = require('./user');  // Correct path to User.js
const Post = require('./post');  // Correct path to Post.js

// Associations (if any)
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post };
