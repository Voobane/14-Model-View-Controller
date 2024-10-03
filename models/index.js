const User = require('./User');  // Correct path to User.js
const Post = require('./Post');  // Correct path to Post.js

// Associations (if any)
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post };
