const { COIN_MAP } = require('./constants');

const SERVICES = ['coinmarketcap', 'coinapi', 'coingecko'];

const validatePassedCoins = (coins) => {
	const validCoins = [];

	for(const coin of coins){
		if(!COIN_MAP[coin]){
			throw new Error(`Invalid coin passed: ${coin}`);
		}
		validCoins.push(coin.toUpperCase());
	}

	return validCoins;
};

const validatePassedServices = (services) => {
	const validServices = {};

	for(const [service, apiKey] of Object.entries(services)){
		if(!apiKey){
			throw new Error(`No API key passed for service: ${service}`);
		}
		if(!SERVICES.includes(service.toLowerCase())){
			throw new Error(`Invalid service passed: ${service}`);
		}
		validServices[service.toLowerCase()] = apiKey;
	}
};

module.exports = ({
	coins = [],
	services = {},
	priceUpdateInterval = 60 * 60 * 1000, // 1 hour
	callback = () => {}
}) => {
	coins = validatePassedCoins(coins);
	services = validatePassedServices(services);

	if(!coins || coins.length < 1){
		throw new Error('No coins passed');
	}
	if(!services || Object.keys(services).length < 1){
		throw new Error('No services passed');
	}
	if(services.length < 2){
		console.warn('Only 1 service passed, this may result in less-redundant prices');
	}
	if(priceUpdateInterval < 1000){
		console.warn('Price update interval is very low! This may cause issues with some services.');
	}

	const updatePrices = () => {
	};

	let interval = setInterval(updatePrices, priceUpdateInterval);

	// Get price of single stored currency
	const getPrice = (coin) => {
		coin = coin.toUpperCase();
	};

	// Get prices of all stored currencies
	const getAllPrices = () => {

	};

	// restart the interval
	const restart = () => {
		clearInterval(interval);
		interval = setInterval(updatePrices, priceUpdateInterval);
	};

	// stop updating prices
	const stop = () => {
		clearInterval(interval);
	};

	return {
		getPrice,
		getAllPrices,
		restart,
		stop
	};
};