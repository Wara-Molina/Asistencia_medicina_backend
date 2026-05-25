import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",

  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/helpers/resetUsuarios.ts"],

  testMatch: ["**/__tests__/**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
