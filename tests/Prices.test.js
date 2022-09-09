require('dotenv').config();

const { fetchAllServices } = require('../helpers/prices.helper');
const { getPricesBasedOnDeviations } = require('../utilities/stats.utility');
const { COIN_MAP } = require('../constants');

(async () => {
	const prices = await fetchAllServices({
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		coinapi: process.env.COINAPI_API_KEY,
		coingecko: true
	}, Object.keys(COIN_MAP));

	console.log(prices);

	console.log(getPricesBasedOnDeviations(prices, {
		BTC: 30,
		ETH: 5,
		LTC: 4,
		XRP: 0.5,
		DOGE: 0.005,
		BCH: 6,
		USDT: 0.0005,
		USDC: 0.0005,
		ADA: 0.009,
		XLM: 0.0005,
		DOT: 0.5,
		NEO: 0.5,
		BNB: 5
	}));
})();