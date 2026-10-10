import { setUser } from "./config";
import {
  createUser,
  getUser,
  getUserById,
  listUsers,
  resetTable,
} from "../lib/db/queries/users";

import { createFeed, printFeed } from "../lib/db/queries/feeds";
import { readConfig } from "./config";

import { fetchFeed } from "../lib/rss";
import { getFeeds } from "../lib/db/queries/feeds";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Please write your name!");
  }

  const userGet = await getUser(args[0]);
  if (!userGet) {
    throw new Error("The user doesn't exist!");
  }
  setUser(args[0]);
  console.log("The user has been set!");
}

export type CommandsRegistry = Record<string, CommandHandler>;

export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (handler === undefined) {
    throw new Error("undefined");
  }
  await handler(cmdName, ...args);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Please write your name!");
  }
  const userName = args[0];
  const user = await createUser(userName);
  setUser(user.name);
  console.log("User registered successfully!");
  console.log(user);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Please write only reset function.");
  }
  await resetTable();
  console.log("Successful reset.");
}

export async function getUsers(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Please write only list function.");
  }

  const userList = await listUsers();
  const config = readConfig();
  for (const user of userList) {
    if (user.name == config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}

export async function handlerAgg(cmdName: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed, null, 2));
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const config = readConfig();
  const currentUserName = config.currentUserName;
  const user = await getUser(currentUserName);

  if (!user) {
    throw new Error("Current user not found");
  }
  const name = args[0];
  const url = args[1];

  const feed = await createFeed(name, url, user.id);
  if (!feed) {
    throw new Error("Failed to create feed");
  }
  printFeed(feed, user);
}

export async function handlerFeedsList(cmdName: string, ...args: string[]) {
  const feedsList = await getFeeds();
  for (let feed of feedsList) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    console.log(feed.name, feed.url, user.name);
  }
}
