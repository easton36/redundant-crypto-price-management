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
	maximumTimeDeviation: 100 // Maximum deviation between the newest price and the mean of the previous 24 hours of prices
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