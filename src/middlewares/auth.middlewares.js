import Joi from 'joi'
import jwt from 'jsonwebtoken'

export function isAuth(req, res, next) {
	const auth = req.get('Authorization')
	try {
		const token = auth.split(' ')[1]
		const verify = jwt.verify(token, process.env.PRIVATE_KEY)
		req.user = verify.user
		next()
	} catch (error) {
		res.status(401).send('Error: User not authorized')
	}
}

export async function login(req, res, next) {
	const { body } = req
	const schema = Joi.object({
		userName: Joi.string().alphanum().required(),
		password: Joi.string().alphanum().min(8).required(),
	})
	try {
		await schema.validateAsync(body)
		next()
	} catch (error) {
		res.status(400).json(error)
	}
}
