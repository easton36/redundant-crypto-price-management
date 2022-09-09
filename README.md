# redundant-crypto-price-management
Library for tracking crypto prices from a number of sources with redundancy to prevent price manipulation errors 

## Reasoning
Coinmarketcap had a bug in late 2021 that surged the prices of all cryptocurrencies on their platform for multiple hours. Sites (most notable one that I can think of being csgoempire.com) that relied on them for accurate crypto prices to manage things like deposits and withdrawals (in amounts of fiat currency and not crypto) lost major amounts of money. 

Robust systems cannot rely on a single point of failure.

## How it works
I understand that crypto prices fluctuate a lot, so I will only be comparing prices to the last 24 hours.

Every X amount of time, prices for a list of currencies will be fetched from various cryptocurrency pricing APIs. The standard deviation between the different APIs will be taken. If the deviation exceeds X, then steps will be taken to find which API is giving faulty data. If data from all APIs is inconclusive, the price will not be saved. If the data is conclusive, a mean of the different APIs' prices will be taken and labelled as the newest price.

Then, mean of the last 24 hours of prices will be taken (this does not include the newest price) then the percent deviation of the 24 hour mean compared to the newest price will be taken. If the deviation percentage is greater than X, the price will be considered invalid and will not be saved.

## Price logging
The default method for logging prices will be JSON files. I will add support for other cold databases like MongoDB and PostgresSQL (or another SQL flavor)

## Current Crypto Price APIs
Currently supporting:
 - [CoinMarketCap](https://coinmarketcap.com/)
 - [CoinAPI](https://coinapi.io)
 - [CoinGecko](coingecko.com)
