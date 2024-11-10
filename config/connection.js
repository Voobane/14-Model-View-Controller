const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production config (Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Development config (local)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "127.0.0.1",
      dialect: "postgres",
      port: 5432,
      logging: console.log,
    }
  );
}

module.exports = sequelize;
