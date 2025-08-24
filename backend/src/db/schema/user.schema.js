import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    userName: varchar('user_name', {length: 255}).notNull().unique(),
    email: varchar('email', {length: 255}).notNull().unique(),
    password: varchar('password', {length:255}).notNull(),
    createdAt: timestamp('created_at').defaultNow()
});

export default users;