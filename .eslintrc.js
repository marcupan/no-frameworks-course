module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    IS_DEVELOPMENT: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    // https://eslint.org/docs/rules/
    'no-fallthrough': 'off', // https://github.com/ionic-team/eslint-config/issues/7
    'no-constant-condition': 'off',

    // https://github.com/benmosher/eslint-plugin-import
    'import/first': 'warn',
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        groups: ['external', 'builtin', 'parent', 'sibling', 'index'],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/no-mutable-exports': 'warn',
  },
};
