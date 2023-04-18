import pkg from "./package.json" assert { type: "json" };
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
  
    output: [
      {
        name: "stateMachine",
        file: pkg.main,
        format: "umd",
      },
      {
        file: pkg.browser,
        name: "stateMachine",
        format: "iife",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: [typescript()],
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]


