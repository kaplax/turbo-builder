#!/usr/bin/env bun

import { program } from "commander";
import Builder from "../src";

program
  .name("web-builder")
  .description("An esbuild-based web builder")
  .version("0.0.1");

program
  .option("-p, --port <port>", "The port of server")
  .option("-m, --mode <mode>", "local or test or deployment")
  .parse();

const options = program.opts();

if (options.port) {
  options.port = Number(options.port);
  if (isNaN(options.port)) {
    console.error("Expect for port be a number, but accepted a string");
    options.port = 3000;
  }
}

new Builder({ ...options } as any);

