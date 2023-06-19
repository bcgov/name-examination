module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "google",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {},
};
