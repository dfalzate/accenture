import axios from 'axios'
import { usersModel, coinsModel } from '../models/index.js'
import mongoose from 'mongoose'

export async function getAllCoins(currency, perPage, page) {
	try {
		let response = await axios({
			method: 'GET',
			url: 'https://api.coingecko.com/api/v3/coins/list',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		let coins = response.data.map((coin) => coin.id)
		let newCurrency = ''
		switch (currency) {
			case 'Dólar':
				newCurrency = 'usd'
				break
			case 'Euro':
				newCurrency = 'eur'
				break
			case 'Peso Argentino':
				newCurrency = 'ars'
				break
		}
		let paginatedCoins = coins.slice((page - 1) * perPage, page * perPage)
		paginatedCoins = paginatedCoins.join(',')

		const responsePriceCoins = await axios({
			method: 'GET',
			url: 'https://api.coingecko.com/api/v3/simple/price',
			params: {
				ids: paginatedCoins,
				vs_currencies: newCurrency,
				include_last_updated_at: true,
			},
		})

		for await (let coin of Object.keys(responsePriceCoins.data)) {
			const responseDataCoin = await axios({
				method: 'GET',
				url: `https://api.coingecko.com/api/v3/coins/${coin}`,
			})
			responsePriceCoins.data[coin] = {
				...responsePriceCoins.data[coin],
				name: responseDataCoin.data.name,
				image: responseDataCoin.data.image.small,
			}
		}
		return responsePriceCoins.data
	} catch (error) {
		throw new Error(error)
	}
}

export async function addCoins(userId, symbol) {
	try {
		const user = await usersModel.default.findById(userId)
		if (!user) throw new Error('User not exist')
		const coin = await axios({
			method: 'GET',
			url: 'https://api.coingecko.com/api/v3/simple/price',
			params: {
				ids: symbol,
				vs_currencies: 'usd,eur,ars',
				include_last_updated_at: true,
			},
		})
		if (!coin) throw new Error('La moneda no existe')
		let coinDB = await coinsModel.default.findOne({ symbol })
		if (!coinDB) {
			const coinData = await axios({
				method: 'GET',
				url: `https://api.coingecko.com/api/v3/coins/${symbol}`,
			})
			const newCoin = {
				symbol,
				price: {
					usd: coin.data[symbol].usd,
					eur: coin.data[symbol].eur,
					ars: coin.data[symbol].ars,
				},
				name: coinData.data.name,
				image: coinData.data.image.small,
				lastUpdateDate: coin.data[symbol].last_updated_at,
			}
			const response = await coinsModel.default.create(newCoin)
			coinDB = response
		}
		if (!user?.userCoins?.includes(coinDB._id)) {
			user.userCoins.push(coinDB._id)
		} else {
			throw new Error('El usuario ya cuenta con esta moneda')
		}
		await user.save()
		return user
	} catch (error) {
		throw new Error(error)
	}
}

export async function getTopCoins(userId, N, order = -1, preferredCurrency) {
	try {
		const user = await usersModel.default.findById(userId)
		if (!user) throw new Error('El usuario no existe')
		let newCurrency = null
		switch (preferredCurrency) {
			case 'Dólar':
				newCurrency = 'usd'
				break
			case 'Euro':
				newCurrency = 'eur'
				break
			case 'Peso Argentino':
				newCurrency = 'ars'
				break
		}
		const agg = [
			{
				$match: {
					_id: mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: 'coins',
					localField: 'userCoins',
					foreignField: '_id',
					as: 'coins',
				},
			},
			{
				$unwind: {
					path: '$coins',
				},
			},
			{
				$addFields: {
					coin: '$coins._id',
					symbol: '$coins.symbol',
					price: '$coins.price',
					name: '$coins.name',
					image: '$coins.image',
					last_updated_at: '$coins.last_updated_at',
				},
			},
			{
				$project: {
					coin: 1,
					symbol: 1,
					price: 1,
					name: 1,
					image: 1,
					last_updated_at: 1,
				},
			},
			{
				$limit: N,
			},
		]
		const sort = JSON.parse(`{"$sort":{"price.${newCurrency}":${order}}}`)
		agg.push(sort)
		const response = await usersModel.default.aggregate(agg)
		return response
	} catch (error) {
		throw new Error(error)
	}
}
