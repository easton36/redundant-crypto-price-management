const { calculateCoinStandardDeviation, calculateCoinMean, checkCoinStandardDeviation } = require('../utilities/stats.utility');

// These are real prices taken from the services, use these to base your deviations off of
// all prices are coinmarketcap, coinapi, and coingecko, respectively

// LTC
console.log(calculateCoinStandardDeviation([61.07426556569395, 61.01180188292935, 61.04]));
// -> 0.025540761459051067
console.log(calculateCoinMean([61.07426556569395, 61.01180188292935, 61.04]));
// -> 61.04202248287444
console.log(checkCoinStandardDeviation({
	coinmarketcap: 61.07426556569395,
	coinapi: 61.01180188292935,
	coingecko: 61.04
}, 5));

// BTC
console.log(calculateCoinStandardDeviation([21336.067211902126, 21289.181250189977, 21325]));
// -> 20.01044011652329
console.log(calculateCoinMean([21336.067211902126, 21289.181250189977, 21325]));
// -> 21316.749487364035

// ETH
console.log(calculateCoinStandardDeviation([1715.2688995057479, 1711.168118064422, 1714.58]));
// -> 1.7929469627423913
console.log(calculateCoinMean([1715.2688995057479, 1711.168118064422, 1714.58]));
// -> 1713.6723391900566