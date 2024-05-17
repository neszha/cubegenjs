import path from 'path'
import fs from 'fs-extra'

// test write file
const cacheDir = path.join(process.cwd(), '.cache')
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir)
}
fs.writeFileSync(path.join(cacheDir, 'node.txt'), 'Hello World!', 'utf8')

// test argv
console.log(process.argv[2])