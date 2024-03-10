import { type CubegenObfuscatorConfig } from '../types/obfuscator'

const nodeObfuscatorConfig: CubegenObfuscatorConfig = {
    optionsPreset: 'medium-obfuscation',
    target: 'node',
    seed: 0,
    compact: true,
    simplify: true,
    disableConsoleOutput: false,
    debugProtection: false,
    stringArray: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayThreshold: 1
}

export default nodeObfuscatorConfig
