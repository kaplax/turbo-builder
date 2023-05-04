import * as path from "path";
import { compile } from "./compiler";
// @ts-ignore
import { lessLoader } from "esbuild-plugin-less";

import type { BuildOptions } from "esbuild";

export type BuilderMode = "dev" | "test" | "prod";

export interface BuilderConfig extends BuildOptions {
  port?: number;
  mode?: BuilderMode;
}


const baseConfig: BuilderConfig = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  inject: ["src/react-shim.tsx"],
  outdir: "build",
  splitting: true,
  allowOverwrite: true,
  plugins: [lessLoader()],
  format: "esm",
  port: 3000,
  mode: "dev"
}

const CONFIG_FILE_NAME = "builder.conf.ts";

export async function mergeConfig(config?: BuilderConfig): Promise<BuilderConfig> {
  const configPath = path.join(`${process.cwd()}/${CONFIG_FILE_NAME}`);
  const cmdConfig = config || {} as BuilderConfig;
  try {
    const config = compile(configPath).default;
    return { ...baseConfig, ...config, ...cmdConfig };
  } catch (error) {
    return { ...baseConfig, ...cmdConfig };
  }
}
