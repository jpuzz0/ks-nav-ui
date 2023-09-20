module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsx: true,
    jsx: true,
    js: true,
    useJSXTextNode: true,
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },
  extends: [
    '@redhat-cloud-services/eslint-config-redhat-cloud-services',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    window: 'readonly',
    describe: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    it: 'readonly',
    process: 'readonly',
    document: 'readonly',
    insights: 'readonly',
    shallow: 'readonly',
    render: 'readonly',
    mount: 'readonly',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
      },
    },
  ],
  settings: {
    react: {
      version: '^16.11.0',
    },
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'eslint-plugin-react-hooks'],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    'prettier/prettier': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
};
