import fs from 'fs';
import path from 'path';
import { Router } from 'express'
import users from './store/users.js';

/** 
 * Endpoint level: /api/* 
 * */
const api = new Router();

api.get('/', (req, res) => {
    res.json({
        message: 'Root API!'
    })
})

api.get('/users', (req, res) => {
    res.json({
        users
    })
})

api.get('/address', (req, res) => {
    const addressPath = path.join(process.cwd(), 'src/static-data/address.json')
    const rawJsonString = fs.readFileSync(addressPath, 'utf8')
    res.json({
        addresses: JSON.parse(rawJsonString).addresses
    })
})

/**
 * Export routers.
 * */ 
export default api