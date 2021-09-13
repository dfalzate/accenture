import jwt from 'jsonwebtoken'
import { usersService } from '../services/index.js'

export async function login(req, res) {
	const { body } = req
	try {
		const user = await usersService.getUser(body.userName)
		const password = jwt.verify(user.password, process.env.PRIVATE_KEY).password
		if (password === body.password) {
			const token = jwt.sign(
				{
					user,
				},
				process.env.PRIVATE_KEY,
				{ expiresIn: '1h' },
			)
			res.status(200).json({ token })
		} else {
			res.status(401).send('Error: Verify user or password')
		}
	} catch (error) {
		res.status(400).send(error.message)
	}
}
