import joi from 'joi'

const schema = joi.object({
	N: joi.number().min(1).max(25).required(),
	order: joi.number().valid(1, -1).optional(),
})

export async function topCoins(req, res, next) {
	try {
		schema.validateAsync(req.query)
		next()
	} catch (error) {
		res.status(400).send(error)
	}
}
