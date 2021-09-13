import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		preferredCurrency: {
			type: String,
			enum: ['Euro', 'Dólar', 'Peso Argentino'],
			required: true,
		},
		userCoins: [
			{
				ref: 'Coins',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
	},
	{
		timestamps: true,
	},
)

export default mongoose.model('Users', userSchema)
