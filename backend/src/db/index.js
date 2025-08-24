import { drizzle } from 'drizzle-orm/node-postgres';

//here no database connection happens
//database connection happens when you actually query
const zypdb = drizzle(process.env.DATABASE_URL);

export default zypdb;
