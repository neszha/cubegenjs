import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { delay, Listr } from 'listr2'
import { select } from '@inquirer/prompts'
import { type PackageJson, type CmdInitOptions } from '../interfaces/Command'
import { type TargetEnvironment } from '../interfaces/Common'
import { type InitorUserInput } from '../interfaces/Initor'

const userInput: InitorUserInput = {
    targetEnvironment: 'node'
}

export default {
    cwd: process.cwd(),
    rootProject: '',
    isTest: (process.env.NODE_ENV === 'test'),

    /**
     * Generate cubegen configuration.
     */
    async generate (options: CmdInitOptions): Promise<void> {
        this.rootProject = path.join(this.cwd, options.root || './')
        const packageJson = await this.readPackageJson()
        await this.askTargetEnvironment()
        if (userInput.targetEnvironment !== options.userInput?.targetEnvironment) {
            if (options.userInput?.targetEnvironment) {
                userInput.targetEnvironment = options.userInput.targetEnvironment
            }
        }
        if (userInput.targetEnvironment === 'node') {
            await this.generateNodeProtectorConfigFile(packageJson)
            return
        }
        if (userInput.targetEnvironment === 'browser') {
            await this.generateWebProtectorConfigFile(packageJson)
        }
    },

    /**
     * Read package.json in project.
     */
    async readPackageJson (): Promise<PackageJson> {
        const packageJsonPath = path.join(this.rootProject, 'package.json')
        if (!fs.existsSync(packageJsonPath)) {
            throw new Error('Error: Can not find file `package.json` in your project directory')
        }
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8')
        const packageJson = JSON.parse(packageJsonString) as PackageJson
        if (packageJson.type !== 'module') {
            throw new Error('Error: `package.json` should have type `module`')
        }
        return packageJson
    },

    /**
     * Ask target environment to user.
     */
    async askTargetEnvironment (): Promise<void> {
        if (this.isTest) return
        const answer = await select({
            message: 'Select building target environment:',
            choices: [
                {
                    name: 'NodeJS',
                    value: 'node',
                    description: 'to run on the nodejs runtime in production'
                },
                {
                    name: 'Web Browser',
                    value: 'browser',
                    description: 'to run on the web browser in production'
                }
            ]
        })
        userInput.targetEnvironment = answer as TargetEnvironment
    },

    /**
     * Generate cubegen configuration for node target.
     */
    async generateNodeProtectorConfigFile (packageJson: PackageJson): Promise<void> {
        const __filename = fileURLToPath(import.meta.url)
        const __modulePath = __filename
            .replace(/(\/packages\/cli).*$/, '/packages/cli')
            .replace(/(\/cubegenjs\/cli).*$/, 'cubegenjs/cli')
        const nodeProtectorDirTemplates = path.resolve(__modulePath, '../node-protector//templates')

        // Create tasks.
        const startTime = new Date().getTime()
        const tasks = new Listr([
            {
                title: 'Generate builder file',
                task: async () => {
                    const builderTemplatePath = path.join(nodeProtectorDirTemplates, 'cg.builder.config.js')
                    const builderOutPath = path.join(this.rootProject, 'cg.builder.js')
                    let builderTemplateRaw = fs.readFileSync(builderTemplatePath, 'utf-8')
                    if (fs.existsSync(builderOutPath)) {
                        throw new Error('Error: `cg.builder.js` already exists.')
                    }
                    const randomSha256 = createHash('sha256').update(Math.random().toString()).digest('hex')
                    builderTemplateRaw = builderTemplateRaw.replace('%TARGET%', 'node')
                    builderTemplateRaw = builderTemplateRaw.replace('%APP_KEY%', randomSha256)
                    builderTemplateRaw = builderTemplateRaw.replace('%SEED%', randomSha256.slice(0, 16))
                    if (packageJson.main) {
                        builderTemplateRaw = builderTemplateRaw.replace('index.js', packageJson.main)
                    }
                    fs.writeFileSync(builderOutPath, builderTemplateRaw)
                    await delay(500)
                }
            },
            {
                title: 'Generate protector file',
                task: async () => {
                    const protectorTemplatePath = path.join(nodeProtectorDirTemplates, 'cg.protector.config.js')
                    const protectorOutPath = path.join(this.rootProject, 'cg.protector.js')
                    const protectorTemplateRaw = fs.readFileSync(protectorTemplatePath, 'utf-8')
                    if (fs.existsSync(protectorOutPath)) {
                        throw new Error('Error: `cg.protector.js` already exists.')
                    }
                    fs.writeFileSync(protectorOutPath, protectorTemplateRaw)
                    await delay(500)
                }
            },
            {
                title: '',
                task: async (ctx, task) => {
                    const endTime = new Date().getTime() - startTime
                    const durationInSeconds = endTime / 1000
                    task.title = `Done in ${durationInSeconds.toFixed(1)}s`
                }
            }
        ])
        await tasks.run()
    },

    /**
     * Generate cubegen configuration for node target.
     */
    async generateWebProtectorConfigFile (packageJson: PackageJson): Promise<void> {
        const __filename = fileURLToPath(import.meta.url)
        const __modulePath = __filename
            .replace(/(\/packages\/cli).*$/, '/packages/cli')
            .replace(/(\/cubegenjs\/cli).*$/, 'cubegenjs/cli')
        const nodeProtectorDirTemplates = path.resolve(__modulePath, '../web-protector//templates')

        // Create tasks.
        const startTime = new Date().getTime()
        const tasks = new Listr([
            {
                title: 'Generate builder file',
                task: async () => {
                    const builderTemplatePath = path.join(nodeProtectorDirTemplates, 'cg.builder.config.js')
                    const builderOutPath = path.join(this.rootProject, 'cg.builder.js')
                    let builderTemplateRaw = fs.readFileSync(builderTemplatePath, 'utf-8')
                    if (fs.existsSync(builderOutPath)) {
                        throw new Error('Error: `cg.builder.js` already exists.')
                    }
                    const randomSha256 = createHash('sha256').update(Math.random().toString()).digest('hex')
                    builderTemplateRaw = builderTemplateRaw.replace('%TARGET%', 'browser')
                    builderTemplateRaw = builderTemplateRaw.replace('%APP_KEY%', randomSha256)
                    builderTemplateRaw = builderTemplateRaw.replace('%SEED%', randomSha256.slice(0, 16))
                    if (packageJson.main) {
                        builderTemplateRaw = builderTemplateRaw.replace('index.js', packageJson.main)
                    }
                    fs.writeFileSync(builderOutPath, builderTemplateRaw)
                    await delay(500)
                }
            },
            {
                title: 'Generate protector file',
                task: async () => {
                    const protectorTemplatePath = path.join(nodeProtectorDirTemplates, 'cg.protector.config.js')
                    const protectorOutPath = path.join(this.rootProject, 'cg.protector.js')
                    const protectorTemplateRaw = fs.readFileSync(protectorTemplatePath, 'utf-8')
                    if (fs.existsSync(protectorOutPath)) {
                        throw new Error('Error: `cg.protector.js` already exists.')
                    }
                    fs.writeFileSync(protectorOutPath, protectorTemplateRaw)
                    await delay(500)
                }
            },
            {
                title: '',
                task: async (ctx, task) => {
                    const endTime = new Date().getTime() - startTime
                    const durationInSeconds = endTime / 1000
                    task.title = `Done in ${durationInSeconds.toFixed(1)}s`
                }
            }
        ])
        await tasks.run()
    }
}
