import Builder from "./builder";
import { mergeConfig, type BuilderMode, type BuilderConfig } from "./config";
import { loaderEnv } from "./loaders/env";
import { loaderTemp } from "./loaders/temp";

export type { BuilderConfig } from "./config";


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
    const mergedConfig = await mergeConfig(params);
    loaderEnv(mergedConfig);
    loaderTemp({config: mergedConfig});
    return mergedConfig;
  }
  async start(config: BuilderConfig) {
    const builder = new Builder(config);
    if (config.mode === "dev") {
      builder.server();
    } else {
      builder.build();
    }
  }
}
