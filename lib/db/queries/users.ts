import { db } from "../../index";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const result = await db.query.users.findFirst({
    where: (tableColumns, operators) => operators.eq(tableColumns.name, name),
  });

  return result;
}

export async function resetTable() {
  await db.delete(users);
}

export async function listUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return firstOrUndefined(result);
}
