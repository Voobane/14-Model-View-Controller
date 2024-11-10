const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  // Method to check password validity
  async checkPassword(loginPw) {
    return await bcrypt.compare(loginPw, this.password);
  }

  // Method to get public user data (excludes sensitive info)
  toPublicJSON() {
    const { id, username, createdAt } = this;
    return { id, username, createdAt };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        notEmpty: true,
        isNotEmail(value) {
          if (value.includes("@")) {
            throw new Error("Username cannot be an email address");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
        notEmpty: true,
      },
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    account_locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      // Hash password before creating user
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Hash password before updating user
      async beforeUpdate(updatedUserData) {
        if (updatedUserData.changed("password")) {
          updatedUserData.password = await bcrypt.hash(
            updatedUserData.password,
            10
          );
        }
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
