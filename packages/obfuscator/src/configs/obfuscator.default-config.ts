import { type ObfuscatorOptions } from 'javascript-obfuscator'
import { CubegenObfuscatorEnvironmentTarget } from '../enums/ObfuscatorEnum'

export default {
    // Environment Target
    target: CubegenObfuscatorEnvironmentTarget.NODE,

    // Random Generator
    seed: 0,

    // Control Flow Flattening
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,

    // Converting
    numbersToExpressions: true,
    transformObjectKeys: true,
    splitStrings: true,
    splitStringsChunkLength: 10,

    // Renaming
    renameGlobals: true, // This option MAY break your code
    renameProperties: false, // This option MAY break your code
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

    // Simplify
    compact: true,
    simplify: true

} satisfies ObfuscatorOptions
