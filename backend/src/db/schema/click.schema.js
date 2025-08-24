import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

const clicks = pgTable('clicks', {
    id: serial('id').primaryKey(),
    urlId: varchar('url_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    ip: varchar('ip', {length: 255}),
    userAgent: varchar('user_agent', {length: 255}),
    country: varchar('country', {length: 255}),
    referer: varchar('referer', {length: 255})
})

export default clicks;