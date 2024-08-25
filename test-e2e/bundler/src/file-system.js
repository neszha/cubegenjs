import path from 'path'
import fs from 'fs-extra'
import { sayHello } from './childs/hello.js'

// Read json file.
const filePath = path.join(process.cwd(), 'storage/message.json')
const rowData = fs.readFileSync(filePath, 'utf8')

// Parse json.
const jsonData = JSON.parse(rowData)
console.log(jsonData)

// Show hello word.
sayHello()