import fs from 'fs'
import path from 'path'

// Get raw content in data/message.txt
const filePath = path.join(process.cwd(), 'data/message.txt')
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err)
    } else {
        console.log(data)
    }
})