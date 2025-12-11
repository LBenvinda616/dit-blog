const { Sequelize } = require("sequelize");

/**
 * Sequelize connection to Postgres using env configuration.
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
    }
);

module.exports = sequelize;
