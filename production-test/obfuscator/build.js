import path from 'path'
import fs from 'fs-extra'
import { CubegenObfuscator } from "@cubegenjs/obfuscator";

const obfuscateCode = async () => {
    // Create dist directory.
    const distPath = path.join(process.cwd(), 'dist')
    await fs.ensureDir(distPath)

    // Hello word code.
    const sampleTestHelloWordPath = path.join(process.cwd(), 'src/hello-word.sample-test.js')
    const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
    obfuscator.setCustomConfig({
        seed: 'custom-seed'
    })
    const result = obfuscator.transform()
    const sampleTestHelloWordOutputPath = path.join(distPath, 'hello-word.sample-test.js')
    await fs.copyFile(result.outputTempPath, sampleTestHelloWordOutputPath)

    // Md5 code.
    const sampleTestMd5Path = path.join(process.cwd(), 'src/md5.sample-test.js')
    const obfuscatorMd5 = new CubegenObfuscator(sampleTestMd5Path)
    obfuscatorMd5.setCustomConfig({
        seed: 'custom-seed'
    })
    const resultMd5 = obfuscatorMd5.transform()
    const sampleTestMd5OutputPath = path.join(distPath, 'md5.sample-test.js')
    await fs.copyFile(resultMd5.outputTempPath, sampleTestMd5OutputPath)

    // Copy package.json
    const packageJsonPath = path.join(process.cwd(), 'src/package.json')
    const packageJsonOutputPath = path.join(distPath, 'package.json')
    await fs.copyFile(packageJsonPath, packageJsonOutputPath)

    // Done.
    console.log('Success and save result in ./dist')
}

obfuscateCode()