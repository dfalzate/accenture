import Joi from 'joi'

const userData = Joi.object({
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	userName: Joi.string().alphanum().required(),
	password: Joi.string().alphanum().required(),
	preferredCurrency: Joi.string().valid('Euro', 'Dólar', 'Peso Argentino').required(),
})

export async function validateUser(req, res, next) {
	const { body } = req
	try {
		await userData.validateAsync(body)
		next()
	} catch (error) {
		res.status(400).json(error)
	}
}
