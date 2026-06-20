import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: '../../drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://epilogue:epilogue@localhost:5432/epilogue',
  },
  strict: true,
  verbose: true,
});
