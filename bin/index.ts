#!/usr/bin/env bun

import { program } from "commander";
import Builder from "../src";

program
  .name("web-builder")
.description("An esbuild-based web builder")
.version("0.0.1");

program
.option("-p, --port <port>", "The port of server", "3000")
.option("-m, --mode <mode>", "local or test or deployment", "local")
.parse();

const options = program.opts();

let p  = Number(options.port);

if (isNaN(p)) {
  console.error("Expect for port be a number, but accepted a string");
  p = 3000;
}

new Builder(options as any);

