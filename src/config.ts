import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function getConfigFilePath() {
  const homeDir = os.homedir();
  return path.join(homeDir, ".gatorconfig.json");
}

export function readConfig() {
  const path = getConfigFilePath();
  const readJSON = JSON.parse(fs.readFileSync(path, "utf-8"));
  return {
    dbUrl: readJSON.db_url,
    currentUserName: readJSON.current_user_name ?? "",
  };
}
export function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);

  fs.writeFileSync(filePath, data, { encoding: "utf-8" });
}

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}
