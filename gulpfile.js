import { deleteAsync } from 'del'
import { task, series } from 'gulp'

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

    // cli module.
    await deleteAsync([
        'packages/cli/dist'
    ], { force: true })

    // done.
    return true
})

/**
 * Run task.
 */
task('default', series('clear:builder-directory'))
