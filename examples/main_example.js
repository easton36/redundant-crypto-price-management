const CoinStore = require('../index');

const store = CoinStore({
	coins: ['btc', 'eth', 'xrp'],
	services: {
		coinmarketcap: 'YOUR_API_KEY',
		coinapi: 'YOUR_API_KEY',
		coingecko: 'YOUR_API_KEY'
	},
	callback: (event, data) => {
		switch(event){
		case 'price_update':
			for(const [coin, price] of Object.entries(data)){
				console.log(`[${coin.toUpperCase()}] $${price}`);
			}
		}
	}
});

console.log(store.getPrice('btc'));

console.log(store.getAllPrices());