import { and, eq } from "drizzle-orm";
import { rulesTable, userTable } from "../db/schema";
import { db } from "../db";

async function authorizeAPIKey(apiKey: string, endpoint: string) {
  const matchingRules = await db
    .select({ apiKey: userTable.api_key })
    .from(userTable)
    .innerJoin(rulesTable, eq(userTable.id, rulesTable.user_id))
    .where(
      and(eq(userTable.api_key, apiKey), eq(rulesTable.endpoint, endpoint)),
    );

  return matchingRules.length > 0;
}

export default authorizeAPIKey;
