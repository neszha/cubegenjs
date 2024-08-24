#!/usr/bin/env node

import fs from 'fs'
import { Command } from 'commander'
import { type CmdInitOptions, type CmdBuildOptions } from '@cubegenjs/cli_test/src/interfaces/Command'
import builder from '@cubegenjs/cli_test/src/commands/build'
import initor from '@cubegenjs/cli_test/src/commands/init'

/**
 * Get module version.
 */
let moduleVersion = '0.0.0'
const packageJsonPath = '../../package.json'
if (fs.existsSync(packageJsonPath)) {
    const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonString)
    moduleVersion = packageJson.version
}

/**
 * Initialize.
*/
const program = new Command()
program.name('cubegen')
    .description('Protecting and Optimizing your JavaScript Source Code')
    .version(moduleVersion)

/**
 * Init command.
 */
program.command('init')
    .description('Initialize cubegen configuration.')
    .option('-r, --root <string>', 'Relative root project directory', './')
    .action(async (options: CmdInitOptions): Promise<void> => {
        await initor.generate(options)
    })

/**
 * Build command.
 */
program.command('build')
    .description('Building your project to distribution code.')
    .option('-r, --root <string>', 'Relative root project directory', './')
    .action(async (options: CmdBuildOptions): Promise<void> => {
        await builder.build(options)
    })

/**
 * Render the command program.
 */
program.parse()
