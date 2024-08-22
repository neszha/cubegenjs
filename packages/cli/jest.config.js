/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    maxWorkers: 1,
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true
            }
        ]
    }
}
