import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool = null;
export function isDbConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);
}
export async function getPool() {
  if (!isDbConfigured()) return null;
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 8,
      decimalNumbers: true
    });
  }
  return pool;
}
