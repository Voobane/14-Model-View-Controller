const User = require('.post/User');
const Post = require('.post/Post');

// A user can have many posts
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

// A post belongs to one user
Post.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post };
