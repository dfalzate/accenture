import express from 'express'
import { usersMiddleware } from '../middlewares/index.js'
import { usersControllers } from '../controllers/index.js'

const router = new express.Router()

router.post('/createUser', usersMiddleware.validateUser, usersControllers.createUser)

export { router }
