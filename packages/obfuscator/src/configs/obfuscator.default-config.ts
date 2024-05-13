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
    splitStringsChunkLength: 3,

    // Renaming
    renameGlobals: true,
    renameProperties: true,
    renamePropertiesMode: 'safe',
    identifierNamesGenerator: 'mangled-shuffled',

    // String Array
    stringArray: true,
    stringArrayThreshold: 0.2,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: [],
    stringArrayIndexesType: [
        'hexadecimal-number'
    ],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    stringArrayWrappersType: 'function',

    // Simplifying
    compact: true,
    simplify: true

} satisfies ObfuscatorOptions
