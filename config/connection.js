//__________________________For local user only___________________________________

const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432,
  }
);

module.exports = sequelize;

//__________________________For Render user only___________________________________

// const Sequelize = require('sequelize');
// require('dotenv').config();

// let sequelize;

// if (process.env.DB_URL) {
//   sequelize = new Sequelize(process.env.DB_URL);
// } else {
//   sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PW,
//     {
//       host: 'localhost', //<<< correct?
//       dialect: 'postgres',
//     },
//   );
// }
// module.exports = sequelize;
