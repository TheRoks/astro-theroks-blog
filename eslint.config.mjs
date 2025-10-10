// @ts-check

// Flat config for ESLint
// - JS base rules from @eslint/js
// - Astro recommended flat config
// - TypeScript via typescript-eslint (non-typed to match previous setup)
// - Prettier to disable formatting rules

import eslint from "@eslint/js";
import astroPlugin from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Ignore build output and vendored artifacts
  {
    ignores: [
      // from legacy .eslintignore
      "dist",
      "node_modules",
      ".github",
      "src/content/types.generated.d.ts",
      // general
      ".astro",
      "public",
    ],
  },

  // Base JS recommended only for JS/TS files (not .astro)
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx,mts,cts}"],
    extends: [eslint.configs.recommended],
  },

  // Project language options + common rules carried over (only JS/TS files)
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Keep smart-tabs behavior from legacy config
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    },
  },

  // Node config files: allow require/module globals
  {
    files: ["**/*.config.{js,cjs,mjs}", "**/.*rc.{js,cjs}", "astro.config.mjs", ".prettierrc.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Astro recommended (handles .astro parsing)
  astroPlugin.configs["flat/recommended"],
  // Ensure TypeScript is used inside <script> of .astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // TypeScript recommended (no type-checking) only for TS files
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...tseslint.configs.recommended],
  },

  // TS-specific tweaks carried over from legacy config
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "off",
      // Avoid duplicate false-positives in TS files
      "no-undef": "off",
    },
  },

  // Astro: relax a few TypeScript rules within .astro where template syntax can confuse TS rules
  {
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // Config files may use require() in CJS files
  {
    files: ["**/*.config.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Prettier last to turn off formatting rules
  prettier
);
