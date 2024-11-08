import fs from 'fs';
import path from 'path';
import users from './store/users.js';

/**
 * Export routers.
 * */ 
export default (fastify) => {
    fastify.get('/api', (req, res) => {
        return {
            message: 'Root API!'
        }
    })

    fastify.get('/api/users', (req, res) => {
        return {
            users
        }
    })

    fastify.get('/api/address', (req, res) => {
        const addressPath = path.join(process.cwd(), 'src/static-data/address.json')
        const rawJsonString = fs.readFileSync(addressPath, 'utf8')
        return{
            addresses: JSON.parse(rawJsonString).addresses
        }
    })
}