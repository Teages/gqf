# @teages/gqf

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

<!-- [![bundle][bundle-src]][bundle-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

> [!WARNING]
> WIP!
>
> The package is fully completed, but unit tests, export names, and some non-major functions may have break change.

Writing GraphQL queries with type safety and type hints, power by TypeScript.

- ✨ [Stackblitz Playground](https://stackblitz.com/~/github.com/Teages/gqf-playground?file=src/index.ts)
- 📖 [Documentation](https://gqf.teages.xyz)

## Usage

Install package:

```sh
# npm
npm install @teages/gqf

# yarn
yarn add @teages/gqf

# pnpm
pnpm install @teages/gqf

# bun
bun install @teages/gqf
```

Import:

```js
// ESM
import { useSchema } from '@teages/gqf'
```

```js
// CommonJS
const { useSchema } = require('@teages/gqf')
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@teages/gqf?style=flat&color=blue
[npm-version-href]: https://npmjs.com/package/@teages/gqf
[npm-downloads-src]: https://img.shields.io/npm/dm/@teages/gqf?style=flat&color=blue
[npm-downloads-href]: https://npmjs.com/package/@teages/gqf

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/Teages/gqf/main?style=flat&color=blue
[codecov-href]: https://codecov.io/gh/Teages/gqf

[bundle-src]: https://img.shields.io/bundlephobia/minzip/@teages/gqf?style=flat&color=blue
[bundle-href]: https://bundlephobia.com/result?p=@teages/gqf -->
