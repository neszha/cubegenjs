# Publish Packages

Basic guide to publish packages to npm.js

## Publish package for production testing

Enter to packages or module project.
```sh
cd packages/<package_name>
```

Update name in `package.json` with different name. Example: @package_name`_test`

Build package to dist.
```sh
npm run build
```

After that, publish package to registry.
```sh
npm login
npm publish --access public
```

After testing, unpublish package before 72 hours.
```sh
npm unpublish
```

## Publish package to real production

Enter to packages or module project.
```sh
cd packages/<package_name>
```

Update version in `package.json` with increase the version number.

Build package to dist.
```sh
npm run build
```

After that, publish package to registry.
```sh
npm login
npm publish --access public
```

`WARNING:` Can't unpublish after publish this packages. 