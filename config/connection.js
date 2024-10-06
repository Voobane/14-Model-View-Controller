let sequelize;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: 'localhost',
      dialect: 'postgres',
    },
  );
}

// For  localhost use

//const Sequelize = require('sequelize');
//require('dotenv').config();

//const sequelize = new Sequelize(
  //process.env.DB_NAME,
  //process.env.DB_USER,
  //process.env.DB_PASSWORD,
  //{
    //host: 'localhost',
    //dialect: 'postgres',
    //port: 5432
  //}
//);

//module.exports = sequelize;
