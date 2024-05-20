import path from 'path'
import fs from 'fs-extra'
import { deleteAsync } from 'del'
import { task, src, dest, series } from 'gulp'

/**
 * Clear builder directory.
 */
task('clear:builder-directory', async () => {
    // root module.
    await deleteAsync([
        '.cache',
        '.cubegen-cache',
        '.npm-dist',
        'dist'
    ], { force: true })

    // common module.
    await deleteAsync([
        'packages/common/dist'
    ], { force: true })

    // bundler module.
    await deleteAsync([
        'packages/bundler/.bundler-cache',
        'packages/bundler/.cache',
        'packages/bundler/.test-temp',
        'packages/bundler/dist'
    ], { force: true })

    // obfuscator module.
    await deleteAsync([
        'packages/obfuscator/.obfuscator-cache',
        'packages/obfuscator/.test-temp',
        'packages/obfuscator/dist'
    ], { force: true })

    // node-protector module.
    await deleteAsync([
        'packages/node-protector/.test-temp',
        'packages/node-protector/dist'
    ], { force: true })

    // done.
    return true
})

/**
 * Build npm dist directory.
 */
task('build:npm-dist-directory', async () => {
    // root module
    await src('dist/**/*').pipe(dest('.npm-dist/'))
    await src('LICENSE').pipe(dest('.npm-dist/'))
    await src('package.json').pipe(dest('.npm-dist/'))
    await src('README.md').pipe(dest('.npm-dist/'))

    // common module.
    await src('packages/common/package.json').pipe(dest('.npm-dist/packages/common/'))
    await src('packages/common/dist/**/*').pipe(dest('.npm-dist/packages/common/dist'))

    // bundler module.
    await src('packages/bundler/package.json').pipe(dest('.npm-dist/packages/bundler/'))
    await src('packages/bundler/dist/**/*').pipe(dest('.npm-dist/packages/bundler/dist'))

    // obfuscator module.
    await src('packages/obfuscator/package.json').pipe(dest('.npm-dist/packages/obfuscator/'))
    await src('packages/obfuscator/dist/**/*').pipe(dest('.npm-dist/packages/obfuscator/dist'))

    // node-protector module.
    await src('packages/node-protector/package.json').pipe(dest('.npm-dist/packages/node-protector/'))
    await src('packages/node-protector/dist/**/*').pipe(dest('.npm-dist/packages/node-protector/dist'))

    // Done.
    return true
})

task('build:package-json', async () => {
    // Manipulate root package.json.
    const rootDir = process.cwd()
    const packageJsonString = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
    const packageJson = JSON.parse(packageJsonString)
    packageJson.bin.cubegen = 'esm/bin/cubegen.js'
    fs.writeFileSync(path.join(rootDir, '.npm-dist', 'package.json'), JSON.stringify(packageJson, null, 4), 'utf8')

    // Done.
    return true
})

/**
 * Run task.
 */
task('default', series('clear:builder-directory'))
