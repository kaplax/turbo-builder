import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { type BuilderConfig } from ".";

export function readFile(path: string) {
  try {
    const buf = readFileSync(path);
    return buf.toString();
  } catch (error) {
    return "";
  }
}

export function writeFile(path: string, content: string) {
  return writeFileSync(path, content);
}

export async function writeStaticFile(config: BuilderConfig, content = '') {
  const outdir = config.outdir!;
  try {
    if (!existsSync(outdir)) {
      mkdirSync(outdir)
    }

    writeFileSync(`${outdir}/index.html`, content);
  } catch (error) {
    console.error(error);
  }
}
