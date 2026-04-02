// app/lib/schema.ts
import { mysqlTable, serial, int, varchar, decimal, datetime } from 'drizzle-orm/mysql-core';

// User Table Schema
export const User = mysqlTable('User', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  passwordHash: varchar('passwordHash', { length: 191 }).notNull(),
  createdAt: datetime('createdAt').notNull(),
});

// Order Table Schema
export const Order = mysqlTable('orders', {
  id: serial('id').primaryKey(),
  user_id: int('user_id').notNull(),
  product_id: int('product_id').notNull(),
  order_id: varchar('order_id', { length: 191 }).notNull(),
  payment_id: varchar('payment_id', { length: 191 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  paid_at: datetime('paid_at').notNull(),
});

// Optional: Add this if you need migrations
export type User = typeof User.$inferSelect;
export type Order = typeof Order.$inferInsert;