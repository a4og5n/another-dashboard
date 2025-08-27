import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disallow logging of process.env or any object containing 'API_KEY', 'SECRET', or 'DEBUG ENV'
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name=/log|debug|info/][arguments.0.object.name='process'][arguments.0.property.name='env']",
          message: "Do not log process.env or environment variables.",
        },
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name=/log|debug|info/][arguments.0.value=/API_KEY|SECRET|DEBUG ENV/]",
          message: "Do not log secrets, API keys, or sensitive config.",
        },
      ],
    },
  },
];

export default eslintConfig;
