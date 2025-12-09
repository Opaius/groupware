import "dotenv/config";
import { Pool } from "pg";
declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: Pool;
};
export default db;
//# sourceMappingURL=index.d.ts.map