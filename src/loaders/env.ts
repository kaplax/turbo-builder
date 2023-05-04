import * as path from "path";
import * as dotenv from "dotenv";
import { type BuilderConfig } from "../config";

export const loaderEnv = (config: BuilderConfig) => {
  const filePath = path.join(`${process.cwd()}/.env.${config.mode}`);
  dotenv.config({ path: filePath});
}
