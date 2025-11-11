import { $ } from "bun";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  console.error("SUPABASE_URL is not set in the environment variables.");
  process.exit(1);
}

await $`supabase gen types typescript --db-url ${supabaseUrl} > src/lib/database.types.ts`;
