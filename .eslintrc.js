module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    ecmaVersion: 2020
  },
  plugins: [
    "quasar",
    "import",
  ],
  rules: {
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],

    'vue/max-attributes-per-line': 0,
    'vue/valid-v-for': 0,

    // allow async-await
    'generator-star-spacing': 'off',

    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    'quotes': ['error', 'single', { "allowTemplateLiterals": true }],
    "prettier/prettier": ["error", { "singleQuote": true }],
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
