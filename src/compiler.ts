import * as path from "path";
import * as ts from "typescript";
import * as fs from "fs";
import * as Module from "module";

// @ts-ignore
Module._extensions['.ts'] = function(module: any, filename: string) {

  const fileFullPath = path.resolve(__dirname, filename);
  const content = fs.readFileSync(fileFullPath, 'utf-8');

  const { outputText } = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
    }
  });

  // @ts-ignore
  module._compile(outputText, filename);
}

export function compile(fileName: string) {
  delete require.cache[fileName];
  const res = require(fileName);
  return res
}

