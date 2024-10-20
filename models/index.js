const User = require('./user');
const Post = require('./post');

// Associations (if any)
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post };
