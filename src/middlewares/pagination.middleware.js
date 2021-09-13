import joi from 'joi'

const schema = joi.object({
	perPage: joi.number().min(1).max(50).required(),
	page: joi.number().positive().required(),
})

export async function pagination(req, res, next) {
	try {
		const perPage = req.query.perPage ? Number(req.query.perPage) : undefined
		const page = req.query.page ? Number(req.query.page) : undefined
		await schema.validateAsync({ perPage, page })
		next()
	} catch (error) {
		res.status(400).send(error.message)
	}
}
