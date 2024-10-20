#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import { type CmdBuildOptions, type CmdInitOptions } from '../interfaces/Command'
import builder from '../commands/build.js'
import initor from '../commands/init.js'

/**
 * Get module version.
 */
let moduleVersion = '0.0.0'
const packageJsonPath = path.join(process.cwd(), 'node_modules', 'cubegenjs', 'package.json')
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
    .description('initialize cubegen configuration')
    .option('-r, --root <string>', 'relative root project directory', './')
    .action(async (options: CmdInitOptions): Promise<void> => {
        await initor.generate(options)
    })

/**
 * Build command.
 */
program.command('build')
    .description('building your project to distribution code')
    .option('-r, --root <string>', 'relative root project directory', './')
    .action(async (options: CmdBuildOptions): Promise<void> => {
        await builder.build(options)
    })

/**
 * Render the command program.
 */
program.parse()
