import { type ObfuscatorOptions } from 'javascript-obfuscator'

const nodeObfuscatorConfig: ObfuscatorOptions = {
    optionsPreset: 'medium-obfuscation',
    target: 'node',
    disableConsoleOutput: false,
    debugProtection: false,
    stringArrayThreshold: 1,
    simplify: false,
    seed: 0
}

export default nodeObfuscatorConfig
