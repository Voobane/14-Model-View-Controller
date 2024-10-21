const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  // Method to check if the entered password matches the hashed password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    // Primary key for the user
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Username must be unique and not null
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Password must be at least 8 characters long
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Minimum length requirement for password
      },
    },
  },
  {
    hooks: {
      // Hash the password before a new user is created
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Hash the password before updating an existing user's password
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
