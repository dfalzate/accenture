import { coinsService } from '../services/index.js'

export async function getAllCoins(req, res) {
	const { user } = req
	const perPage = Number(req.query.perPage)
	const page = Number(req.query.page)
	try {
		const response = await coinsService.getAllCoins(user.preferredCurrency, perPage, page)

		res.status(200).json({
			data: response,
			page,
			perPage,
		})
	} catch (error) {
		res.status(400).send(error.message)
	}
}

export async function addCoins(req, res) {
	const { body, user } = req
	try {
		const response = await coinsService.addCoins(user._id, body.coin)
		res.status(200).json(response)
	} catch (error) {
		res.status(400).send(error.message)
	}
}

export async function getTopCoins(req, res) {
	const { user } = req
	const N = Number(req.query.N)
	const order = Number(req.query.order)
	try {
		const response = await coinsService.getTopCoins(user._id, N, order, user.preferredCurrency)
		res.status(200).json(response)
	} catch (error) {
		res.status(400).send(error.message)
	}
}
