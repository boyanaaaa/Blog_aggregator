import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig();
console.log(config.dbUrl);

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});
