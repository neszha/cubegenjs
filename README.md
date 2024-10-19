# CubegenJS

[![NPM Version](http://img.shields.io/npm/v/cubegenjs.svg?style=flat)](https://www.npmjs.org/package/cubegenjs)
[![NPM Downloads](https://img.shields.io/npm/dm/cubegenjs.svg?style=flat)](https://npmcharts.com/compare/cubegenjs?minimal=true)

Protecting and Optimizing your JavaScript Source Code.

## Table of contents

- [Installation](#installation)
- [Configuration and Usage](#configuration-and-usage)
- [Options](#options)
    - [Cubegen Builder](#cubegen-builder)
        - [appKey](#appkey)
        - [target](#target)
        - [buildCommand](#buildcommand)
        - [codeBundlingOptions](#codebundlingoptions)
        - [codeObfuscationOptions](#codeobfuscationoptions)
    - [Cubegen Protector](#cubegen-protector)
        - [onStart](#onstart)
        - [onDocumentLoaded](#ondocumentloaded)
        - [onDomainNotAllowed](#ondomainnotallowed)
        - [onModifiedCode](#onmodifiedcode)
        - [onIntervalCall](#onintervalcall)
    - [Cubegen CLI](#cubegen-cli)
- [Support](#support)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/package/cubegenjs).

This module can be used on node or web projects develop with Node.js version 18.0 or higher.

Installation is done using the `npm install` command:
```sh
npm install --save-dev cubegenjs
```
or 
```sh
yarn add --dev cubegenjs
```

## Configuration and Usage

You need create two configuration files `cg.builder.js` and `cb.protector.js`.

Generate these files with the command:
```sh
npx cubegen init
```

After that, you have to select the target environment `NodeJS` or `Web Browser` based on your project type.

To use protector, you mush import `cg.protector.js` file in your project. 

For example Express.js project in `/src/index.js`:
```js
import express from 'express'
import '../cg.protector.js'

const app = express()
app.listen(3000, () => {
    ...
})
```
or React.js project in `/src/App.jsx`:
```js
import { useState } from 'react'
import '../cg.protector.js'

function App() {
    ...
}
```

After everything is done, build your project with the command:
```sh
npx cubegen build
```

## Options

The module use `cg.builder.js` and `cb.protector.js` files to define how the module works. Each properties and methods can be set according to your project needs.

### Cubegen Builder

The `cg.builder.js` file contains the rules for how your project will be transformed with bundlers and obfuscators.

#### `appKey`

Type: `string` Default: `<generate by system>`

Application key for generate private keys inner your code. You can use a custom random characters.

#### `target`

Type: `string` Default: `<generate by system>`

Target where your application will be run in production. Available options: `node` and `browser`

#### `buildCommand`

Type: `string` Default: `npm run build`

⚠️ Only available in web project.

Command to build your web project. The build command example: `npm run build` or `yarn build`. 

#### `codeBundlingOptions`

Type: `object` Default: `{}`

⚠️ Only available in node project.

Bundler option to optimize your code with parcel.

Example:
```js
codeBundlingOptions: {
    rootDir: './',
    outDir: './dist',
    entries: [
        'src/main.js',
        'src/worker.js'
    ],
    staticDirs: [
        'public',
        'storages'
    ],
    buildMode: 'production'
}
```

#### `codeObfuscationOptions`

Type: `object` Default: `{}`

Obfuscation option to obfuscate your protector code with javascript-obfuscator. 

Example:
```js
codeObfuscationOptions: {
    target: 'node',
    seed: '0fddc96ac6cad3b0',
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    ...
    compact: true,
    simplify: true
}
```

See more option in https://github.com/javascript-obfuscator/javascript-obfuscator?tab=readme-ov-file#options

### Cubegen Protector

The `cg.protector.js` file is the protection algorithm for your project. Your code in `cg.protector.js` will be fully obfuscated after the build process is complete.

#### `onStart()`

This method will be called after protector is started.

Example:
```js
onStart(() => {
    console.log('Cubegen protector is starting.')
})
```

#### `onDocumentLoaded()`

⚠️ Only available in web project.

This method will be called after after DOM loaded.

Example:
```js
onDocumentLoaded(() => {
    console.log('Web document is loaded.')
})
```

#### `onDomainNotAllowed()`

⚠️ Only available in web project.

This method will be called if site host is not in the whitelist.

Example only allow hosted web app in `localhost:*`:
```js
const domainLockingOptions = {
    enabled: true,
    whitlist: [
        'localhost',
        'localhost:\\d+',
        '127.0.0.1:\\d+'
    ]
}
onDomainNotAllowed(domainLockingOptions, () => {
    window.location.host = 'https://your_site.com'
})
```

#### `onModifiedCode()`

⚠️ Only available in node project.

This method will be called if distributed code changed or not match with signiture.

Example:
```js
const modifiedCodeOptions = {
    enabled: true
}
onModifiedCode(modifiedCodeOptions, () => {
    console.log('Source code is changed.')
    process.exit()
})
```

#### `onIntervalCall()`

This method will be called continuously.

Example:

```js
const intervalCallOptions = {
    enabled: false,
    eventLoopInterval: 5000
}
onIntervalCall(intervalCallOptions, () => {
    // call monitoring service or do something
})
```

### Cubegen CLI

Cubegen provides a terminal interface to manage your project.

CLI options of `npx cubegen`:
```
-v, --version
-h, --help

commands:
init [options]          building your project to distribution code
build [options]         asdf

options:
-r, --root <string>     relative root project directory (default: "./")
```

## Support

The main forum for free and community support is the project [Issues](https://github.com/neszha/cubegenjs/issues) on GitHub.