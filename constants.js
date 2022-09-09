const COIN_MAP = { // Map of coin symbols to their full name
	BTC: 'bitcoin',
	ETH: 'ethereum',
	LTC: 'litecoin',
	DOGE: 'dogecoin',
	BCH: 'bitcoin-cash',
	USDT: 'tether',
	XRP: 'ripple',
	ADA: 'cardano',
	DOT: 'polkadot',
	XLM: 'stellar',
	USDC: 'usd-coin',
	NEO: 'neo',
	BNB: 'binancecoin'
};

const SERVICES = ['coinmarketcap', 'coinapi', 'coingecko'];

module.exports = {
	COIN_MAP,
	SERVICES
};