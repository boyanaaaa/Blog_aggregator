import { db } from "../../index";
import { feeds } from "../../../schema";

import { Feed, User } from "../../../schema";

export async function createFeed(
  feed_name: string,
  url: string,
  userId: string,
) {
  const [result] = await db
    .insert(feeds)
    .values({ name: feed_name, url, userId })
    .returning();
  return result;
}

export async function printFeed(feed: Feed, user: User) {
  console.log(`
    Created_at: ${feed.createdAt},
    Feed_id: ${feed.id},
    Feed_name: ${feed.name},
    Updated_at: ${feed.updatedAt},
    URL: ${feed.url},
    User_id: ${feed.userId},
    User_name: ${user.name},
  `);
}
