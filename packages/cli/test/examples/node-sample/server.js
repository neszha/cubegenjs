import fs from 'fs'
import http from 'http'
import './cg.protector.js'

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    const htmlContent = fs.readFileSync('./public/index.html', 'utf-8')
    res.end(htmlContent)
})

const PORT = 3000
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})
