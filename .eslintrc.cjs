/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],
  rules: {
    "prefer-template": "warn",
    "vue/block-lang": ["error", { script: { lang: "ts" } }],
    "vue/component-api-style": ["error", ["script-setup"]],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/custom-event-name-casing": ["error", "camelCase"],
    "vue/no-empty-component-block": "error",
    "vue/no-template-target-blank": "error",
    "vue/no-useless-mustaches": "error",
    "vue/padding-line-between-blocks": "error",
    "vue/prefer-separate-static-class": "error",
    "vue/prefer-true-attribute-shorthand": "error",
    "vue/v-for-delimiter-style": "error",
    "vue/v-on-function-call": "error",
    "vue/no-undef-components": "error",
  },
  env: {
    "vue/setup-compiler-macros": true,
  },
};
