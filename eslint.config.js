export default [
  {
    ignores: ['dist/**'],
  },
  {
    files: ['webpack.config.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        FormData: 'readonly',
        DOMParser: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: ['prettier'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'function-paren-newline': ['error', 'multiline'],
      'prettier/prettier': 'error',
    },
  },
];
