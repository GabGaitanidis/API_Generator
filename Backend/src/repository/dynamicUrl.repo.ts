import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { rulesTable } from "../db/schema";
import authorizeAPIKey from "../service/authorizeAPIKey";

async function getDynamicsUrlData(userId: number, endpoint: string) {
  const result = await db
    .select({ dataSchema: rulesTable.dataSchema })
    .from(rulesTable)
    .where(
      and(eq(rulesTable.user_id, userId), eq(rulesTable.endpoint, endpoint)),
    );

  if (!result.length) return false;
  return result;
}

export { authorizeAPIKey, getDynamicsUrlData };
