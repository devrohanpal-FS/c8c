import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'public/**',
      '*.config.js',
      'next-env.d.ts',
      'tests/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
      'react/no-unescaped-entities': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
];

export default eslintConfig;
