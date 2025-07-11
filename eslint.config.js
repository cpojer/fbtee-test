import nkzw from '@nkzw/eslint-config';

export default [
  ...nkzw,
  {
    ignores: ['dist/', 'vite.config.ts.timestamp-*'],
  },
  {
    rules: {
      '@nkzw/no-instanceof': 0,
      '@typescript-eslint/array-type': [2, { default: 'generic' }],
      'import-x/no-extraneous-dependencies': [
        2,
        {
          devDependencies: ['vite.config.ts', 'eslint.config.js'],
          packageDir: [import.meta.dirname],
        },
      ],
      'unicorn/prefer-dom-node-append': 0,
    },
  },
];
