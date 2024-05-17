import { builder, onModified, setModificationProtectionOptions, onStart } from '../../../node-protector/dist/index.js'

/**
 * Builder Options.
 */
const builderOptions = {
    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'server.js'
        ],
        staticDirs: [
            'public'
        ],
        packageJson: {
            type: 'commonjs',
            hideDependencies: false,
            hideDevDependencies: true
        }
    },
    codeObfuscationOptions: {
        target: 'node',
        seed: 0
    }
}
builder.setBuilderOptions(builderOptions)

/**
 * Run action after node protector is started.
 */
onStart(() => {
    console.log('exec: onStart')
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
    console.log('exec: onModified')
})
