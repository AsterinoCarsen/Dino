import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url: string = process.env.DATABASE_URL!;
const key: string = process.env.DATABASE_KEY!;

const db: SupabaseClient = createClient(url, key);

export default db;