import express from 'express'
import { authMiddleware, paginationMiddleware, topCoinsMiddleware } from '../middlewares/index.js'
import { coinsControllers } from '../controllers/index.js'

const router = express.Router()

router.get('/', authMiddleware.isAuth, paginationMiddleware.pagination, coinsControllers.getAllCoins)
router.post('/', authMiddleware.isAuth, coinsControllers.addCoins)
router.get('/top', authMiddleware.isAuth, topCoinsMiddleware.topCoins, coinsControllers.getTopCoins)
export { router }
