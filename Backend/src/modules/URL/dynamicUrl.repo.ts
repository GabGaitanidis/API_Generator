import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { rulesTable, userTable } from "../../db/schema";
import authorizeAPIKey from "../Auth/authorizeAPIKey";

async function getDynamicsUrlData(apiKey: string, endpoint: string) {
  const result = await db
    .select({ dataSchema: rulesTable.dataSchema })
    .from(rulesTable)
    .where(
      and(eq(rulesTable.api_key, apiKey), eq(rulesTable.endpoint, endpoint)),
    );

  if (!result.length) return false;
  return result;
}

export { authorizeAPIKey, getDynamicsUrlData };
