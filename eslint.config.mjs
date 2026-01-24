// @ts-check

// Flat config for ESLint
// - JS base rules from @eslint/js
// - Astro recommended flat config
// - TypeScript via typescript-eslint (non-typed to match previous setup)
// - JSX accessibility plugin for a11y checks
// - Prettier to disable formatting rules

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astroPlugin from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
  // Ignore build output and vendored artifacts
  globalIgnores([
    // Build outputs and caches
    "**/dist/**",
    "**/node_modules/**",
    "**/.astro/**",
    // Generated types
    "src/content/types.generated.d.ts",
    // Static assets
    "public/**",
    // CI/CD
    ".github/**",
  ]),

  // Base JS recommended for all JS/TS files
  eslint.configs.recommended,

  // TypeScript recommended (no type-checking) for TS files
  ...tseslint.configs.recommended,

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

  // TS-specific tweaks carried over from legacy config
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      // Avoid duplicate false-positives in TS files
      "no-undef": "off",
    },
  },

  // Node config files: allow require/module globals
  {
    files: ["**/*.config.{js,cjs,mjs}", "**/.*rc.{js,cjs}", "astro.config.mjs", ".prettierrc.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Config files may use require() in CJS files
  {
    files: ["**/*.config.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Astro recommended (handles .astro parsing)
  ...astroPlugin.configs.recommended,

  // Ensure TypeScript is used inside <script> of .astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
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

  // JSX accessibility for TSX/JSX files using flat config
  {
    files: ["**/*.{tsx,jsx}"],
    ...jsxA11y.flatConfigs.recommended,
  },

  // Prettier last to turn off formatting rules
  prettier,
]);
