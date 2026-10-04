import { db } from "../../index";
import { users } from "../../../schema";

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
