import * as esbuild from "esbuild";
import * as http from "http";
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
    let proxy: any;

    while (needNext) {
      try {
        const { host, port: ctxPort } = await ctx.serve({ servedir });
        proxy = http.createServer((req, res) => {
          const forwardRequest = (path: string) => {
            const options = {
              host, port: ctxPort, path, method: req.method
            }

            const proxyReq = http.request(options, (proxyRes) => {
              if (proxyRes.statusCode === 404) {
                return forwardRequest("/")
              }

              res.writeHead(proxyRes.statusCode!, proxyRes.headers)
              proxyRes.pipe(res, { end: true })
            })

            req.pipe(proxyReq, { end: true })
          }
          forwardRequest(req.url!)
        })
        proxy.listen(port)
        console.log("running at http://127.0.0.1:" + port);
        needNext = false;
      } catch (error) {
        proxy?.close?.();
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
