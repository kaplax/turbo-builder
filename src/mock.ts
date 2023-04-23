import { type BuilderConfig } from "./"
import * as express from "express";
import * as cors from "cors";

import type { RequestHandler } from "express";

export type MockServeType = Record<string, RequestHandler>;

type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export default class MockServe {
  config: BuilderConfig = {}
  constructor(config: BuilderConfig) {
    this.config = config;
  }
  async start() {

    try {
      const mockPath = `${process.cwd()}/${this.config.mockDir!}/index.ts`;
      const res = await import(mockPath);
      const config = res.default as Record<string, RequestHandler>;

      const app = express();

      app.use(cors());

      const port = this.config.mockServePort;

      Object.keys(config).forEach((key) => {
        const keys = key.split(" ") as string[];
        const method: Uppercase<Method> = keys.length === 2 ? (keys[0].toUpperCase() as Uppercase<Method>) : "GET";
        const url = keys.length === 2 ? keys[1] : keys[0];
        const handle = config[key];

        switch (method) {
          case "ALL":
            app.all(url, handle);
            break;
          case "GET":
            app.get(url, handle);
            break
          case "POST":
            app.post(url, handle);
            break;
          case "PUT":
            app.put(url, handle);
            break;
          case "HEAD":
            app.head(url, handle);
            break;
          case "PATCH":
            app.patch(url, handle);
            break;
          case "DELETE":
            app.delete(url, handle);
            break;
          case "OPTIONS":
            app.options(url, handle);
          default:
            app.get(url, handle);
            break;
        }
      })

      app.listen(port, () => {
        console.log(`server of mock listening on port ${port}...`);
      });

    } catch (error) {
      console.error(error);
    }
  }
}





