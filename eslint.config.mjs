// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
    files: ["**/*.{js,ts}"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
        parserOptions: {
            projectService: true,
        },
    },
    ignores: ["node_modules"],
    rules: {
        // "no-console": "warn",
        // "no-var": "error",
        "dot-notation": "error",
    },
});
