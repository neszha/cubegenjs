/**
 * Cubegen builder configuration.
 */

export default {
    /**
     * Application key for generate private keys inner your code.
     *
     * You can use a custom random characters.
     */
    appKey: '%APP_KEY%',

    /**
     * Target where your application will be run in production.
     *
     * Available options: 'node' & 'browser'
     */
    target: '%TARGET%',

    /**
     * Bundler option to optimize your code.
     *
     * See documentation in https://github.com/neszha/cubegenjs/blob/develop/README.md#codebundlingoptions
     */
    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'index.js'
            // Register another your entry file here. Example: 'main.js'
        ],
        staticDirs: [
            // Register your static directory here. Example: 'public'
        ],
        buildMode: 'production'
    },

    /**
     * Obfuscation option to obfuscate your protector code.
     *
     * See documentation in https://github.com/neszha/cubegenjs/blob/develop/README.md#codeobfuscationoptions
     */
    codeObfuscationOptions: {
        // Target Environment
        target: 'node',

        // Random Generator
        seed: '%SEED%',

        // Control Flow Flattening
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,

        // Converting
        numbersToExpressions: true,
        transformObjectKeys: true,
        splitStrings: true,
        splitStringsChunkLength: 10,

        // Renaming
        renameGlobals: true, // This option may break your code
        renameProperties: false, // This option may break your code
        renamePropertiesMode: 'safe',
        identifierNamesGenerator: 'mangled-shuffled',

        // String Array
        stringArray: true,
        stringArrayThreshold: 1,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 1,
        stringArrayEncoding: [
            'base64'
        ],
        stringArrayIndexesType: [
            'hexadecimal-number',
            'hexadecimal-numeric-string'
        ],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',

        // Minifier
        compact: true,
        simplify: true
    }
}
