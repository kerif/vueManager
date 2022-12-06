module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false, // 行位是否使用分号，默认为true
        trailingComma: 'none', // 是否使用尾逗号，有三个可选值"<none|es5|all>"
        singleQuote: true, // 字符串是否使用单引号，默认为false，使用双引号
        printWidth: 100, // 一行的字符数，如果超过会进行换行，默认为80
        tabWidth: 2, // 一个tab代表几个空格数
        useTabs: false, // 启用tab缩进
        bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
        jsxSingleQuote: true,
        jsxBracketSameLine: true,
        arrowParens: 'avoid',
        endOfLine: 'auto',
        'space-before-function-paren': ['error', 'never'],
        'no-param-reassign': ['error', { props: false }]
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}