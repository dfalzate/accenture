import { usersModel } from '../models/index.js'

export async function createUser(data) {
	try {
		const exist = await usersModel.default.findOne({ userName: data.userName })
		if (exist) {
			throw new Error(`User ${data.userName} already exists`)
		}
		const response = await usersModel.default.create(data)
		return response
	} catch (error) {
		throw new Error(error)
	}
}

export async function getUser(userName) {
	try {
		const user = await usersModel.default.findOne({ userName })
		if (!user) {
			throw new Error('User not found')
		}
		return user
	} catch (error) {
		throw new Error(error)
	}
}
