import morgan from 'morgan'
import express, { Router } from 'express'

const router = new Router()

/** 
 * Middlewhare express in route level. 
 * */
router.use(morgan('tiny'))
router.use(express.json())

// Routings.
router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/api', (req, res) => {
    res.json({
        message: 'Api server is ready.'
    })
})

/**
 * Export to main file.
 */
export default router
