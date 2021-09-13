import express from 'express'
import { usersRouter, authRouter, coinsRouter } from './routers/index.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', usersRouter.router)
app.use('/coins', coinsRouter.router)
app.use('/auth', authRouter.router)

export { app }
