import { eq } from "drizzle-orm";
import { db } from "../../db";
import { userTable } from "../../db/schema";

export async function findUserByEmail(email: string) {
  const users = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  return users[0] ?? null;
}

export async function findUserById(id: number) {
  const users = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  return users[0] ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  api_key: string;
}) {
  const inserted = await db.insert(userTable).values(data).returning();

  return inserted[0];
}

export async function updateRefreshToken(userId: number, token: string | null) {
  await db
    .update(userTable)
    .set({ refresh_token: token })
    .where(eq(userTable.id, userId));
}

export async function findPublicUserById(id: number) {
  const users = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      api_key: userTable.api_key,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  return users[0] ?? null;
}
