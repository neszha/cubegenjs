## About Project

End to end test for bundler module CubegenJS.

## Run Test

Install dependencis.
```sh
npm install
```

Exec original code.
```sh
node src/cli.js
node src/file-system.js 
node src/main.js
```

Exec `build.js` to bundle entry files in `src/*`.
```sh
node build.js
```

Exec bundled code in `dist/`.
```sh
cd dist
```
```sh
node src/cli.js
node src/file-system.js 
node src/main.js
```
