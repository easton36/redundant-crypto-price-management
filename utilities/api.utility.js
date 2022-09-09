const axios = require('axios');

const { COIN_MAP } = require('../constants');

const formatAxiosError = (err) => err.response?.data?.message || err.response?.data?.error || err.response?.data || err.message || err;

// Fetch specific price from CoinAPI.io (they dont support multiple cryptos in one request)
const fetchCoinApiPrice = async (coin, apiKey) => {
	try{
		const { data } = await axios({
			method: 'GET',
			url: `https://rest.coinapi.io/v1/exchangerate/${coin.toUpperCase()}/USD`,
			headers: {
				'X-CoinAPI-Key': apiKey
			}
		});

		return data.rate || 0;
	} catch(err){
		console.log(`[CoinAPI] Error fetching price for ${coin.toUpperCase()}: ${formatAxiosError(err)}`);

		return null;
	}
};

// Fetch all prices from CoinAPI.io
const fetchAllCoinApiPrices = async (coins, apiKey) => {
	const prices = {};

	for(const coin of coins){
		const price = await fetchCoinApiPrice(coin, apiKey);

		if(typeof price === 'number') prices[coin] = price;
	}

	return prices;
};

// Fetch all prices from coinmarketcap.com
const fetchAllCoinMarketCapPrices = async (coins, apiKey) => {
	try{
		const { data } = await axios({
			method: 'GET',
			url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
			headers: {
				'X-CMC_PRO_API_KEY': apiKey
			}
		});

		const validCoins = data.data.filter(coin => coins.includes(coin.symbol));

		const prices = {};

		for(const coin of validCoins){
			prices[coin.symbol] = coin?.quote?.USD?.price || 0;
		}

		return prices;
	} catch(err){
		console.log(`[CoinMarketCap] Error fetching prices: ${formatAxiosError(err)}`);

		return {};
	}
};

// Fetch all prices from coingecko.com
const fetchAllCoinGeckoPrices = async (coins) => {
	try{
		const coinIds = Object.keys(COIN_MAP).filter(coin => coins.includes(coin)).map(symbol => COIN_MAP[symbol]).join(',');

		const { data: responseData } = await axios({
			method: 'GET',
			url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=USD`
		});

		const prices = {};

		for(const [coin, data] of Object.entries(responseData)){
			const symbol = Object.keys(COIN_MAP).find(key => COIN_MAP[key] === coin);

			prices[symbol] = data.usd;
		}

		return prices;
	} catch(err){
		console.log(`[CoinMarketCap] Error fetching prices: ${formatAxiosError(err)}`);

		return {};
	}
};
module.exports = {
	fetchAllCoinApiPrices,
	fetchAllCoinMarketCapPrices,
	fetchAllCoinGeckoPrices
};