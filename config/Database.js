import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || "deptech", // DB name
  process.env.DB_USER || "root",    // DB username
  process.env.DB_PASS || "",        // DB password
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",               // DB dialect (MySQL)
  }
);

export default db;
