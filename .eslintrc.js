// http://eslint.org/docs/user-guide/configuring

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
      sourceType: 'module'
  },
  env: {
      browser: true
  },
  plugins: [
      "html"
  ],
  extends: 'airbnb-base',
  settings: {
      'import/resolver': {
          'webpack': {
              'config': ['config/webpack.client.config.js', 'config/webpack.server.config.js', 'config/webpack.base.config.js'],
          }
      }
  },
  rules: {
      "func-names": [0],
      "no-console": [0],
      "no-alert": [0],
      "no-bitwise": [0],
      "eqeqeq": [0],
      "object-shorthand": [0],
      "prefer-arrow-callback": [0],
      "import/no-unresolved": [0],
      "import/no-extraneous-dependencies": [0],
      "no-unused-vars": [0],
      "no-param-reassign": [0],
      "max-len": [0, 150],
      "import/first": [0],
      "global-require": [0],
      "arrow-parens": [0, "as-needed"],
      "no-use-before-define": [0],
      "no-multi-assign": [0],
      "no-unused-expressions": ["error", { "allowShortCircuit": true }],
      "no-underscore-dangle": [0],
      "linebreak-style": [0, "windows"],
      "indent": ["error", 4, { "SwitchCase": 1 }],
      "no-trailing-spaces": [0],
      "comma-dangle": ["error", "only-multiline"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "prefer-template": [0],
      "semi": ["error", "always"],//语句强制不用分号结尾
      "camelcase": [0],
      "no-useless-escape": [0],
      "no-mixed-operators": [0],
      // don't require .vue extension when importing
      'import/extensions': [0, 'always', {
          'js': 'never',
          'vue': 'never'
      }],
      "import/prefer-default-export": [0],
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
