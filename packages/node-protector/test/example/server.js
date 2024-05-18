import http from 'http'
import './coba.js'

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, World!\n')
})

const PORT = 3000
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
