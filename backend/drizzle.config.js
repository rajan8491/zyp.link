import { defineConfig } from 'drizzle-kit';

export default config = defineConfig({
    dialect: 'postgresql',
    out: './drizzle',
    schema: './src/db/schema/*',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
})