import type { BuildOptions } from "esbuild";
// @ts-ignore
import { lessLoader } from "esbuild-plugin-less";


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
  mode: "dev",
}

export async function mergeConfig(config?: BuilderConfig): Promise<BuilderConfig> {
  const configPath = `${process.cwd()}/builder.conf.ts`;
  const cmdConfig = config || {} as BuilderConfig;

  try {
    const res = await import(configPath);
    const config = res.default;

    return { ...baseConfig, ...cmdConfig, ...config };
  } catch (error) {
    return baseConfig;
  }
}
