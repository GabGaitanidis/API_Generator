import { eq } from "drizzle-orm";
import { db } from "../db";
import { userTable } from "../db/schema";

async function getUsers() {
  const users = await db.query.userTable.findMany();
  return users;
}

async function getUsersAPIKey(userId: number) {
  const result = await db
    .select({ apiKey: userTable.api_key })
    .from(userTable)
    .where(eq(userTable.id, userId));

  if (result.length === 0) {
    return null;
  }

  return result[0].apiKey;
}

async function createUser(
  name: string,
  api_key: string,
  email: string,
  password: string,
) {
  const user = await db
    .insert(userTable)
    .values({
      name: name,
      email: email,
      password: password,
      api_key: api_key,
    })
    .returning();

  return user;
}

export { createUser, getUsers, getUsersAPIKey };
