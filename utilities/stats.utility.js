const { getStoreData, filterLast24Hours } = require('./store.utility');

const calculateCoinMean = (prices) => {
	let sum = 0;

	for(const price of prices){
		sum += price;
	}

	return sum / prices.length;
};

const calculateCoinStandardDeviation = (prices) => {
	const mean = calculateCoinMean(prices);

	let sum = 0;

	for(const price of prices){
		sum += Math.pow(price - mean, 2);
	}

	return Math.sqrt(sum / prices.length);
};

const validateCoinStandardDeviation = (prices, maximumDeviation) => {
	const standardDeviation = calculateCoinStandardDeviation(Object.values(prices));

	if(standardDeviation > maximumDeviation) return false;

	return true;
};

const checkCoinStandardDeviation = (prices, maximumDeviation) => {
	const validDeviation = validateCoinStandardDeviation(prices, maximumDeviation);
	if(!validDeviation){
		for(const service of Object.keys(prices)){
			const usedPrices = prices;
			delete usedPrices[service];

			if(Object.keys(usedPrices).length < 2) return { passed: false, badService: service };

			const validDeviation = validateCoinStandardDeviation(usedPrices, maximumDeviation);
			if(validDeviation) return { passed: true, badService: service };
			continue;
		}

		return { passed: false };
	}

	return { passed: true };
};

const getPricesBasedOnDeviations = (coinPrices, maximumDeviations) => {
	const validPrices = {};

	for(const coin of Object.keys(coinPrices)){
		const prices = coinPrices[coin];
		const maximumDeviation = (typeof maximumDeviations === 'number') ? maximumDeviations : maximumDeviations[coin];

		const { passed, badService } = checkCoinStandardDeviation(prices, maximumDeviation);

		if(passed && badService) console.warn(`[${coin}] Price from ${badService} was removed because it was too far from the mean. Overall price is still valid.`);
		if(!passed && badService) console.warn(`[${coin}] Price from ${badService} was removed because it was too far from the mean. Overall price is no longer valid.`);
		if(!passed && !badService) console.warn(`[${coin}] Overall price is not valid.`);

		if(passed) validPrices[coin] = prices;

		continue;
	}

	const overallPrices = {};

	for(const coin of Object.keys(validPrices)){
		const prices = validPrices[coin];

		const mean = calculateCoinMean(Object.values(prices));

		overallPrices[coin] = mean;
	}

	return overallPrices;
};

const getCoinLast24HourMean = (coin, filePath) => {
	const priceData = getStoreData(filePath);

	const last24Hours = filterLast24Hours(priceData);

	const mean = calculateCoinMean(last24Hours.map(item => item.prices[coin]));

	return mean;
};

module.exports = {
	calculateCoinStandardDeviation,
	calculateCoinMean,
	checkCoinStandardDeviation,
	getPricesBasedOnDeviations,
	getCoinLast24HourMean
};