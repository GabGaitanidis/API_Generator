import { urlTable } from "../../db/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

async function getDynamicUrl(userId: number = 1) {
  const url = await db
    .select()
    .from(urlTable)
    .where(eq(urlTable.user_id, userId));
  return url;
}

async function createDynamicUrl(
  userId: number = 1,
  urlString: string,
  rulesId: number,
) {
  const inserted = await db
    .insert(urlTable)
    .values({
      user_id: userId,
      url: urlString,
      rules_id: rulesId,
    })
    .returning();

  if (Array.isArray(inserted)) {
    return inserted[0];
  }

  return inserted;
}

export { createDynamicUrl, getDynamicUrl };
