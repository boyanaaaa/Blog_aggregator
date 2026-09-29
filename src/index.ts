import { registerCommand } from "./commandHandler";
import { handlerLogin } from "./commandHandler";
import { runCommand } from "./commandHandler";
import { CommandsRegistry } from "./commandHandler";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const cliArgs = process.argv.slice(2);
  if (cliArgs.length === 0) {
    console.log("not enough arguments provided");
    process.exit(1);
  }
  const [cmdName, ...args] = cliArgs;
  try {
    runCommand(registry, cmdName, ...args);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
