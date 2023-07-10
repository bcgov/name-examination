module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "google",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    '@vue/standard',
    '@vue/typescript'
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {},
  overrides:{
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ['warn', { code: 120 }],
    'vue/attribute-hyphenation': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-for-template-key-on-child': 'warn',
    'vue/no-v-model-argument': 'warn',
    'vue/v-on-event-hyphenation': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
};
