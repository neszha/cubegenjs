import { builder, onModified, setModificationProtectionOptions, onStart } from '@cubegen/node-protector'

/**
 * Builder Options.
 */
const builderOptions = {
    targetEnvironment: 'node',
    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'server.js',
            'worker.js'
        ],
        staticDirs: [
            'public'
        ],
        packageJson: {
            type: 'module',
            hideDependencies: false,
            hideDevDependencies: true
        }
    },
    codeObfuscationOptions: {
        target: 'node',
        seed: 'abc'
    }
}
builder.setBuilderOptions(builderOptions)

/**
 * Run action after node protector is started.
 */
onStart(() => {
    console.log('Runtime protector is starting.')
})

/**
 * Modification Protection.
 *
 * Set enable to true to enable modification protection.
 */
setModificationProtectionOptions({
    enabled: true
})
onModified(() => {
    console.log('Source code is changed.')
})

/**
 * Protected methods.
 *
 * Create your own protected methods.
 */
export const methods = {
    myPrivateMethod () {
        console.log('My private method executed.')
    }
}
