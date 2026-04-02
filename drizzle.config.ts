import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql2',
  dbCredentials: {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sereyodam',
  },
  schema: './app/lib/schema.ts',
  out: './drizzle',
});