import express from 'express'
import { authControllers } from '../controllers/index.js'

const router = new express.Router()

router.post('/login', authControllers.login)

export { router }
