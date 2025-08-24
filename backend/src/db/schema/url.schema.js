import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const urls = pgTable("urls", {
    id: serial('id').primaryKey(),
    originalURL: text('original_url').notNull().unique(),
    shortCode: varchar('short_code', { length: 255}).notNull().unique(),
    expireAt: timestamp('expire_at', {mode: 'date'}),
    createdAt: timestamp('created_at').defaultNow()
});

export default urls;