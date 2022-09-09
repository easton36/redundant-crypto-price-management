require('dotenv').config();

const CoinStore = require('../index');
const { COIN_MAP } = require('../constants');

const store = CoinStore({
	coins: Object.keys(COIN_MAP),
	priceUpdateInterval: 60 * 60 * 1000, // 1 hour
	services: {
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		coinapi: process.env.COINAPI_API_KEY,
		coingecko: true // No API key required
	},
	maximumServiceDeviation: { // Maximum deviation between services from the mean service price
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
	},
	maximumTimeDeviation: { // Maximum deviation between the newest price and the mean of the previous 24 hours of prices
		BTC: 250,
		ETH: 100,
		LTC: 50,
		XRP: 5,
		DOGE: 5,
		BCH: 50,
		USDT: 0.015,
		USDC: 0.015,
		ADA: 5,
		XLM: 5,
		DOT: 5,
		NEO: 5,
		BNB: 75
	},
	logging: true // Whether to log to console internally or not.
});

store.events.on('price_update', data => {
	console.log('All new prices have been fetched', data);

	console.log(store.getPrice('btc'));
	console.log(store.getAllPrices());
});
store.events.on('coin_price_update', data => {
	console.log(`[${data.coin.toUpperCase()}] Updated price: $${data.price}`);
});
store.events.on('update_error', data => {
	console.error('Error updating prices:', data);
});
store.events.on('deviation_error', data => {
	console.error('Price deviation too high:', data);
});