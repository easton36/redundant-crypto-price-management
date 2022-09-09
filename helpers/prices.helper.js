const {
	fetchAllCoinApiPrices,
	fetchAllCoinMarketCapPrices,
	fetchAllCoinGeckoPrices
} = require('../utilities/api.utility');

const fetchAllServices = async (services, coins) => {
	const prices = {};

	for(const coin of coins){
		prices[coin] = {};
	}

	for(const [service, apiKey] of Object.entries(services)){
		let servicePrices;

		switch(service){
		case 'coinmarketcap':
			servicePrices = await fetchAllCoinMarketCapPrices(coins, apiKey);
			break;
		case 'coinapi':
			servicePrices = await fetchAllCoinApiPrices(coins, apiKey);
			break;
		case 'coingecko':
			servicePrices = await fetchAllCoinGeckoPrices(coins);
			break;
		}

		for(const [coin, price] of Object.entries(servicePrices)){
			prices[coin][service] = price;
		}
	}

	return prices;
};

module.exports = {
	fetchAllServices
};