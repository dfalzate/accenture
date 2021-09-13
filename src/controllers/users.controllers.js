import jwt from 'jsonwebtoken'
import { usersService } from '../services/index.js'

export async function createUser(req, res, next) {
	const { body } = req
	const password = jwt.sign({ password: body.password }, process.env.PRIVATE_KEY)
	body.password = password
	try {
		const response = await usersService.createUser(body)
		res.status(200).json(response)
	} catch (error) {
		res.status(400).send(error.message)
	}
}
