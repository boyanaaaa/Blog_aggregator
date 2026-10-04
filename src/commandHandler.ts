import { setUser } from "./config";
import { createUser, getUser, resetTable } from "../lib/db/queries/users";

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
