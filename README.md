# react-rollup-storybook

## 项目初始化

```bash
yarn init

# 安装 react（因为库是不需要打包 react 相关的包的，所以用 peer 安装)
yarn add react react-dom --peer
```

## TypeScript

```bash
yarn add -D typescript @types/react @types/react-dom

# 生成初始配置
./node_modules/.bin/tsc --init .
```

设置 `tsconfig.json` 如下：

```js
{
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true // 如果不设置，则 `import React from 'react';` 会提示 "This module is declared with using 'export =', and can only be used with a default import when using the 'esModuleInterop' flag" 错误。
    "sourceMap": true,
    "target": "es5",
    "lib": ["es6", "dom"], // pollyfill 编译时 API
  }
}
```

创建 `src/index.tsx` 文件：

```tsx
import React from 'react';
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <h1>{(()=>'hello')()}</h1>
  </div>,
  document.getElementById("root")
);
```

并配置 `package.json` 命令 `"tsc": "tsc -b"`，`yarn tsc` 后测试是否能成功编译（成功生成 `index.js` 文件）。

## rollup 打包

```bash
yarn add -D rollup rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-typescript2 rollup-plugin-terser

# rollup-plugin-node-resolve
# rollup-plugin-commonjs
# rollup-plugin-typescript2 ts 
# rollup-plugin-terser 压缩
```

增加 rollup 配置文件，并配置 `package.json` 命令 `"build": "rollup -c"`。

## Storybook

主要用到 storybook 的可编辑组件示例，以及自动 doc：

* 可编辑示例用到 [storybook addon: knob](https://github.com/storybookjs/storybook/tree/master/addons/knobs)
* 自动 doc 用到 [storybook andon: Info](https://github.com/storybookjs/storybook/tree/master/addons/info) 和 [react-docgen-typescript-loader](https://github.com/strothj/react-docgen-typescript-loader)。


在项目根目录下，快速配置 `npx -p @storybook/cli sb init`，会生成两个文件夹：

* `.storybook`: storybook 配置目录
* `.stories`: 默认 story 文件存放位置


## ESLint 和 Prettier

静态检查、编码风格规范化、统一化，在团队协作里非常重要。

### ESLint

安装依赖：`yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`。

* eslint: ESLint 核心库，依赖 [Espree](https://github.com/eslint/espree) 来将 javascript 代码解析为 ESTree，但是 Espree 并不能识别 Typescript
* @typescript-eslint/parser：可以将 TypeScript 解析为 ESTree
* @typescript-eslint/eslint-plugin：可以打开或关闭的 TypeScript 的规则列表
* [eslint-plugin-reac](https://www.npmjs.com/package/eslint-plugin-react): react 如果用 typescript，可以使用此插件


增加 ESLint 配置文件 `.eslintrc.js`：

```js
module.exports =  {
  parser:  '@typescript-eslint/parser',  // 指定 ESLint 解析器
  extends:  [
    'plugin:@typescript-eslint/recommended',  // 使用 @typescript-eslint/eslint-plugin 中的推荐规则
  ],
 parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  rules:  {
    // 定制 Eslint 规则，也可以用来覆盖 extend 里的配置如  "@typescript-eslint/explicit-function-return-type": "off",
  },
  settings:  {
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
```

### Prettier

安装依赖：`yarn add -D prettier eslint-config-prettier eslint-plugin-prettier`。

* prettier: Prettier 核心库
* eslint-config-prettier: 禁用可能与 prettier 冲突的 ESLint 规则
* eslint-plugin-prettier: 将 prettier 作为 ESLint 规则来运行Runs prettier as an ESLint rule

增加 Prettier 配置文件 `.prettierrc.js`: 

```js
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2
};
```

## Test

### jest 的 snapshot 测试

`yarn add -D jest enzyme ts-jest react-test-renderer @types/jest @types/react-test-renderer @types/enzyme enzyme-adapter-react-16 @types/enzyme-adapter-react-16`

* jest：测试框架
* enzyme：工具库
* enzyme-adapter-react-16: 针对 React 16
* [enzyme-to-json](https://www.npmjs.com/package/enzyme-to-json)：快照 JSON 化
* react-test-renderer：让你可以无需 DOM 就能将 React 组件渲染成 JS 对象

添加 Jest 配置文件 `jest.config.js`：

```js
module.exports = {
  preset: 'ts-jest',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'node',
  transform: {
    // 用 ts-jest 将 tsx 文件编译成 js
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest', // 支持 .ts 文件里直接 import 'xx.scss'
  },
  testRegex: '/src/.*\\.test.(ts|tsx)$', // 正则匹配哪些是要执行的测试文件
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/src/index.test.setup.ts'], // 测试启动文件（即运行测试前会跑的脚本）
  collectCoverage: false, // 是否在执行测试时收集覆盖率信息
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/api/api-test-helpers.ts'], // 设置哪些文件需要（或不需要）覆盖率信息
};
```

enzyme 的全渲染模式（`mount`），需要依赖浏览器环境，可以安装 `yarn add -D jsdom jsdom-global`，并配置 setup：

```ts
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jsdom-global/register'; // jsdom 支持

enzyme.configure({ adapter: new Adapter() });
```

### 视觉测试

安装依赖：`yarn add -D puppeteer jest-puppeteer jest-image-snapshot`。

* puppeteer: 无头浏览器
* jest-puppeteer：用于 UI 测试的 jest presets
* jest-image-snapshot：用来扩展 jest 的 expect

具体配置见 [./scripts/jest/jest.ui.config.js|setup.ui.js](./scripts/jest)

## 其它

### 提交信息规范

* commitizen: 规范化提交信息
* commitlint: 提交信息规范性检查

想要定制 commitizen 规范（其实就是变更 adapter），有两种方式：

1. 使用自定义提交规范 `cz-customizable`，在项目根目录增加 `.cz-config.js`（配置内容参考，配置命令`"commit": "./node_modules/cz-customizable/standalone.js"`。
2. fork 一份 commitizen/cz-conventional-changelog，定制后发版，然后 `czcommitizen init 你的定制包名 --save-dev --save-exact`，具体参考[How to add custom commit types](https://github.com/commitizen/cz-cli/issues/43#issuecomment-151232286)

检查提交 message 规范性，添加 `commitlint.config.js` 文件，增加需要检查的规范。

### husky

> 更方便定制 hooks 操作。

```js
// package.json

"husky": {
  "hooks": {
    "pre-commit": "npm run lint"
  }
}
```

## 参考

1. https://www.typescriptlang.org/docs/handbook/
2. https://storybook.js.org/
3. https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

