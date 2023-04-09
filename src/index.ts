import Builder from "./builder";
import { renderer } from "./temp";
import { writeStaticFile } from "./file";
import { mergeConfig, type BuilderMode, type BuilderConfig } from "./config";
import MockServe from "./mock";
import dotenv from "dotenv";

export type { BuilderConfig } from "./config";
export type { MockServeType } from "./mock";


interface BuilderInitParams {
  port?: number;
  mode: BuilderMode;
}
export default class FeBuilder {
  constructor(params: BuilderInitParams) {
    this.init(params);
  }
  private async init(params: BuilderInitParams) {
    const config = await this.before(params);
    this.start(config);
  }
  private async before(params: { port?: number, mode: BuilderMode }): Promise<BuilderConfig> {
    const { port, mode } = params;
    const mergedConfig = await mergeConfig({ port, mode });
    dotenv.config({ path: `.env.${mergedConfig.mode}` })
    const content = await renderer();
    writeStaticFile(mergedConfig, content);
    return mergedConfig;
  }
  async start(config: BuilderConfig) {
    const builder = new Builder(config);
    if (config.mode === "dev") {
      builder.server();
      if (config.mockServe) {
        const mockServe = new MockServe(config);
        mockServe.start();
      }
    } else {
      builder.build();
    }
  }
}
