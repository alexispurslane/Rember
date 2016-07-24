# broccoli-typescript

[![NPM version](https://badge.fury.io/js/broccoli-typescript.svg)](http://badge.fury.io/js/broccoli-typescript)
[![Build Status](https://travis-ci.org/shinnn/broccoli-typescript.svg?branch=master)](https://travis-ci.org/shinnn/broccoli-typescript)
[![Dependency Status](https://david-dm.org/shinnn/broccoli-typescript.svg)](https://david-dm.org/shinnn/broccoli-typescript)
[![devDependency Status](https://david-dm.org/shinnn/broccoli-typescript/dev-status.svg)](https://david-dm.org/shinnn/broccoli-typescript#info=devDependencies)

[TypeScript](http://typescript.codeplex.com/) compiler for [Broccoli](https://github.com/joliss/broccoli)

## Installation

Install with [npm](https://www.npmjs.org/). (Make sure you have installed [Node](http://nodejs.org/).)

```
npm i --save-dev broccoli-typescript
```

## Example

```javascript
var compileTypeScript = require('broccoli-typescript');
tree = compileTypeScript(tree, options);
```

## API

### compileTypeScript(tree[, options])

#### options.outDir

Type: `String` Default: Build target directory

Output compiled files to the directory. 

#### options.out

Type: `String`

Concatenate and write compilation results to a single file. When this option is specified, the `outDir` option is ignored.

**Note:** Both `outDir` option and `out` option are treated as relative paths from build target directory.

And besides, [all options](https://github.com/jedmao/ts-compiler#tsicompileroptions) for [ts-compiler](https://github.com/jedmao/ts-compiler) are available.

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT LIcense](./LICENSE).
