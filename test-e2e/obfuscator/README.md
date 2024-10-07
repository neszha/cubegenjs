## About Project

End to end test for obfuscator module CubegenJS.

## Run Test

Install dependencis.
```sh
npm install
```

Exec original code.
```sh
node src/hello-word.sample-test.js
node src/md5.sample-test.js
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
node hello-word.sample-test.js
node md5.sample-test.js
```
