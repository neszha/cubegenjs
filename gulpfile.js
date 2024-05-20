import { deleteAsync } from 'del'
import { task, src, dest, series } from 'gulp'

/**
 * Clear builder directory.
 */
task('clear-builder-directory', async () => {
    // root module.
    await deleteAsync([
        '.cache',
        '.cubegen-cache',
        '.npm-publish',
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
 * Build npm publish directory.
 */
task('build-npm-publish-directory', async () => {
    // root module
    await src('dist/**/*').pipe(dest('.npm-publish/'))
    await src('package.json').pipe(dest('.npm-publish/'))
    await src('LICENSE').pipe(dest('.npm-publish/'))
    await src('README.md').pipe(dest('.npm-publish/'))

    // common module.
    await src('packages/common/package.json').pipe(dest('.npm-publish/packages/common/'))
    await src('packages/common/dist/**/*').pipe(dest('.npm-publish/packages/common/dist'))

    // bundler module.
    await src('packages/bundler/package.json').pipe(dest('.npm-publish/packages/bundler/'))
    await src('packages/bundler/dist/**/*').pipe(dest('.npm-publish/packages/bundler/dist'))

    // obfuscator module.
    await src('packages/obfuscator/package.json').pipe(dest('.npm-publish/packages/obfuscator/'))
    await src('packages/obfuscator/dist/**/*').pipe(dest('.npm-publish/packages/obfuscator/dist'))

    // node-protector module.
    await src('packages/node-protector/package.json').pipe(dest('.npm-publish/packages/node-protector/'))
    await src('packages/node-protector/dist/**/*').pipe(dest('.npm-publish/packages/node-protector/dist'))

    // done.
    return true
})

/**
 * Run task.
 */
task('default', series('clear-builder-directory'))
