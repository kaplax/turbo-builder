import esbuild from "esbuild";
import { type BuilderConfig } from "./config";


export default class Builder {
  config: BuilderConfig = {}
  constructor(config: BuilderConfig) {
    this.config = config;
  }
  private getEsBuildConfig() {
    const cc = { ...this.config };
    Reflect.deleteProperty(cc, "port");
    Reflect.deleteProperty(cc, "mode");
    return cc;
  }
  async server() {
    let port = this.config.port!;
    const servedir = this.config.outdir;
    const esbuildConf = this.getEsBuildConfig();

    const ctx = await esbuild.context(esbuildConf);

    let needNext = true;

    while (needNext) {
      try {
        await ctx.serve({ servedir, port });
        console.log("running at http://127.0.0.1:" + port);
        needNext = false;
      } catch (error) {
        ctx.cancel();
        port += 1;
        console.error(`${port - 1} port is being used, started another port at ${port}`);
      }
    }
  }
  async build() {
    const esbuildConf = this.getEsBuildConfig();
    await esbuild.build({ ...esbuildConf, minify: true });
    console.log("successful");
  }
}
