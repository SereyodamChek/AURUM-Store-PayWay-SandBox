// app/lib/db.ts
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3307'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'sereyodam',
});

export const db = drizzle(pool);

export default db;