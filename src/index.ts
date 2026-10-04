import { registerCommand } from "./commandHandler";
import { handlerLogin } from "./commandHandler";
import { runCommand } from "./commandHandler";
import { CommandsRegistry } from "./commandHandler";
import { handlerRegister } from "./commandHandler";
import { handlerReset } from "./commandHandler";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);

  const cliArgs = process.argv.slice(2);
  if (cliArgs.length === 0) {
    console.log("not enough arguments provided");
    process.exit(1);
  }
  const [cmdName, ...args] = cliArgs;
  try {
    await runCommand(registry, cmdName, ...args);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  process.exit(0);
}

main();
