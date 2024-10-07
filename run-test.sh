clear
echo 'Running all jest test...'

## Cubegen Bundler.
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/bundler/test/functional.spec.ts' -c 'packages/bundler/jest.config.js' 
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/bundler/test/compression.spec.ts' -c 'packages/bundler/jest.config.js' 

## Cubegen Obfuscator.
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/obfuscator/test/functional.spec.ts' -c 'packages/obfuscator/jest.config.js'
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/obfuscator/test/compression.spec.ts' -c 'packages/obfuscator/jest.config.js'

## Cubegen Node Protector.
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/node-protector/test/fungsional.spec.ts' -c 'packages/node-protector/jest.config.js'

## Cubegen Web Protector.

## Cubegen CLI.
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/cli/test/init.spec.ts' -c 'packages/cli/jest.config.js'
node --experimental-vm-modules node_modules/jest/bin/jest.js 'packages/cli/test/builder.spec.ts' -c 'packages/cli/jest.config.js'