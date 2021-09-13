import mongoose from 'mongoose'

const coinsSchema = mongoose.Schema({
	symbol: {
		type: String,
		required: true,
	},
	price: {
		usd: {
			type: Number,
		},
		eur: {
			type: Number,
		},
		ars: {
			type: Number,
		},
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	lastUpdateDate: {
		type: Date,
		required: true,
	},
})

export default mongoose.model('Coins', coinsSchema)
