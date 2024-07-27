import { compilerOptions } from "./tsconfig.json";
import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  roots: ["<rootDir>"],
  coverageReporters: ["json", "lcov"],
  testRegex: "/src/.*\\.(test|spec).(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,tsx,ts}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
};

export default jestConfig;
