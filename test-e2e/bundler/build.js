import path from 'path'
import chalk from 'chalk'
import { CubegenBundler } from '@cubegenjs/bundler'

const buildWithBundler = async () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(process.cwd()),
        outDir: path.resolve(process.cwd(), 'dist'),
        entries: [
            'src/cli.js',
            'src/file-system.js',
            'src/main.js',
        ],
        staticDirs: [
            'public',
            'storage'
        ],
    })
    await bundler.build()
    console.log('Success and save result in ' + chalk.green('./dist'))
}

buildWithBundler()