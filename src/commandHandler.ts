import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Please write your name!");
  }

  setUser(args[0]);
  console.log("The user has been set!");
}

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (handler === undefined) {
    throw new Error("undefined");
  }
  handler(cmdName, ...args);
}
