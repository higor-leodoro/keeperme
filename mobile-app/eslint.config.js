const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

module.exports = [
  // Configuração de arquivos ignorados
  {
    ignores: [
      "src/screens/app/asopay/**/*",
      "node_modules/**/*",
      "dist/**/*",
      ".expo/**/*",
      "*.min.js",
      "*.bundle.js",
    ],
  },

  // Configuração base recomendada do ESLint
  js.configs.recommended,

  // Configuração específica para TypeScript/TSX
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        FormData: "readonly",
        fetch: "readonly",
        process: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        alert: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Regras para remover imports não utilizados
      "@typescript-eslint/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // Regras de organização de imports
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // fs, path, etc
            "external", // react, lodash
            "internal", // @src/*
            ["parent", "sibling", "index"],
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
    },
  },
];
