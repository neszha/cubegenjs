import { type ObfuscatorOptions } from 'javascript-obfuscator'

const browserObfuscatorConfig: ObfuscatorOptions = {
    optionsPreset: 'medium-obfuscation',
    target: 'browser',
    disableConsoleOutput: false,
    debugProtection: false,
    seed: 0
}

export default browserObfuscatorConfig
