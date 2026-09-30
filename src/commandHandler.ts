import { setUser } from "./config";
import { createUser, getUser } from "../lib/db/queries/users";

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
  // 1. Check that exactly one argument was passed in `args`.
  //    If not, throw an error (look at handlerLogin for the pattern)
  if (args.length !== 1) {
    throw new Error("Please write your name!");
  }

  // 2. Grab the name from args
  const userName = args[0];

  // 3. Call createUser with that name, and await the result
  //    (remember: createUser is async, so it returns a Promise)
  const user = await createUser(userName);

  // 4. Update the config with the new user's name using setUser
  setUser(user.name);

  // 5. console.log a success message
  console.log("User registered successfully!");

  // 6. console.log the user object for debugging
  console.log(user);
}
