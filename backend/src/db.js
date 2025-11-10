import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Prefer explicit USE_MYSQL=true to use MySQL. Otherwise default to sqlite for local/dev ease.
let sequelize;
if (process.env.USE_MYSQL === 'true') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
    }
  );
} else {
  // sqlite fallback (no external DB required)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './backend.sqlite',
    logging: false,
  });
}

export default sequelize;
