const assert = require('assert');
const path = require('path');
const events = require('events');

const { COIN_MAP, SERVICES } = require('./constants');
const { fetchAllServices } = require('./helpers/prices.helper');
const { getPricesBasedOnDeviations, getCoinLast24HourMean } = require('./utilities/stats.utility');
const { addStoreLog } = require('./utilities/store.utility');

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

	return validServices;
};

const validateMaximumDeviations = (maximumDeviation, coins) => {
	assert(coins.every(coin => maximumDeviation[coin] && typeof maximumDeviation[coin] === 'number'), 'Maximum deviation object contains invalid value. Make sure every coin has an assigned maximum deviation.');

	const validDeviations = {};

	for(const [coin, deviation] of Object.entries(maximumDeviation)){
		validDeviations[coin.toUpperCase()] = Number(deviation);
	}

	return validDeviations;
};

module.exports = ({
	coins = [],
	services = {},
	priceUpdateInterval = 60 * 60 * 1000, // 1 hour
	maximumServiceDeviation = { // Maximum deviation between services from the mean service price
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
	maximumTimeDeviation = { // Maximum deviation between the newest price and the mean of the previous 24 hours of prices
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
	filePath = path.join(__dirname, './data/prices.json'), // File path to store prices in.
	logging = true // Whether to log to console internally or not.
}) => {
	coins = validatePassedCoins(coins);
	services = validatePassedServices(services);

	assert(coins && coins.length > 0, '[coins] No coins passed');
	assert(services && Object.keys(services).length > 0, '[services] No services passed');
	assert(typeof maximumServiceDeviation === 'number' || typeof maximumServiceDeviation === 'object', '[maximumServiceDeviation] Maximum deviation must be a number or an object');
	assert(typeof maximumTimeDeviation === 'number' || typeof maximumTimeDeviation === 'object', '[maximumTimeDeviation] Maximum deviation must be a number or an object');

	if(typeof maximumServiceDeviation === 'object'){
		maximumServiceDeviation = validateMaximumDeviations(maximumServiceDeviation, coins);
	}
	if(typeof maximumTimeDeviation === 'object'){
		maximumTimeDeviation = validateMaximumDeviations(maximumTimeDeviation, coins);
	}

	if(services.length < 2) console.warn('[services] Only 1 service passed, this may result in less-redundant prices');
	if(priceUpdateInterval < 1000) console.warn('[priceUpdateInterval] Price update interval is very low! This may cause issues with some services.');
	if(typeof maximumServiceDeviation === 'number') console.warn('[maximumServiceDeviation] The prices of different coins fluctuate differently with different deviations. It is recommended to pass an object with coin-specific deviations.');
	if(typeof maximumTimeDeviation === 'number') console.warn('[maximumTimeDeviation] The prices of different coins fluctuate differently with different deviations. It is recommended to pass an object with coin-specific deviations.');

	const eventEmitter = new events.EventEmitter();

	const currentPrices = {}; // current prices stored for easy fetching

	const updatePrices = async () => {
		try{
			const newPrices = await fetchAllServices(services, coins);
			if(!newPrices || Object.keys(newPrices).length < 1){
				if(logging) console.warn('New prices failed to be fetched');

				return eventEmitter.emit('update_error', 'New prices failed to be fetched');
			}

			const overallPrices = getPricesBasedOnDeviations(newPrices, maximumServiceDeviation);
			if(!overallPrices || Object.keys(overallPrices).length < 1){
				if(logging) console.warn('No prices could be calculated from deviations');

				return eventEmitter.emit('update_error', 'No prices could be calculated from deviations');
			}

			// data that will be inserted into store
			const newPriceLog = {
				timestamp: new Date().toJSON(),
				nextUpdate: new Date(Date.now() + priceUpdateInterval).toJSON(),
				prices: {
					...currentPrices
				}
			};

			for(const [coin, price] of Object.entries(overallPrices)){
				const last24HourMean = getCoinLast24HourMean(coin, filePath);

				const deviation = (typeof maximumTimeDeviation === 'number') ? maximumTimeDeviation : maximumTimeDeviation[coin];

				const averageDeviation = Math.abs(price - last24HourMean);
				if(averageDeviation > deviation){
					if(logging) console.warn(`Price deviation of ${coin} is too high. Price: ${price}, last 24 hour mean: ${last24HourMean}, deviation: ${averageDeviation}, maximum deviation: ${deviation}. Coin price will not be logged.`);
					eventEmitter.emit('deviation_error', {
						coin,
						price,
						last24HourMean,
						deviation: averageDeviation,
						maximumDeviation: deviation
					});
					continue;
				}
				currentPrices[coin] = price;
				newPriceLog.prices[coin] = price;

				eventEmitter.emit('coin_price_update', {
					coin,
					price,
					deviation: averageDeviation,
					maximumDeviation: deviation
				});

				continue;
			}

			// add new price log to store
			await addStoreLog(filePath, newPriceLog);

			return eventEmitter.emit('price_update', newPriceLog);
		} catch(err){
			if(logging) console.warn('Error fetching prices:', err);

			return eventEmitter.emit('update_error', err);
		}
	};

	let interval = setInterval(updatePrices, priceUpdateInterval);

	// Get price of single stored currency
	const getPrice = (coin) => {
		coin = coin.toUpperCase();

		return currentPrices[coin];
	};

	// Get prices of all stored currencies
	const getAllPrices = () => {
		return currentPrices;
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

	// fetch all prices on startup
	updatePrices();

	return {
		events: eventEmitter,
		getPrice,
		getAllPrices,
		restart,
		stop
	};
};