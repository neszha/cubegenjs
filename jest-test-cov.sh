clear
echo 'Running all jest test coverage...'

## Cubegen Bundler.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c 'packages/bundler/jest.config.js' --coverage

## Cubegen Obfuscator.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c 'packages/obfuscator/jest.config.js' --coverage

## Cubegen Node Protector.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c 'packages/node-protector/jest.config.js' --coverage

## Cubegen Web Protector.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c 'packages/web-protector/jest.config.js' --coverage

## Cubegen CLI.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c 'packages/cli/jest.config.js' --coverage