# redundant-crypto-price-management
Library for tracking crypto prices from a number of sources with redundancy to prevent price manipulation errors 

## Reasoning
Coinmarketcap had a bug in late 2021 that surged the prices of all cryptocurrencies on their platform for multiple hours. Sites (most notable one that I can think of being csgoempire.com) that relied on them for accurate crypto prices to manage things like deposits and withdrawals (in amounts of fiat currency and not crypto) lost major amounts of money. 

Robust systems cannot rely on a single point of failure.

## How it works
I understand that crypto prices fluctuate a lot, so I will only be comparing prices to the last 24 hours. Every X amount of time the price of a currency will be logged. The mean of the last 24 hours of prices will be taken (this does not include the newest price) then the percent deviation of the 24 hour mean compared to the latest price will be taken. If the deviation percentage is greater than a set value, the price will be considered invalid and will not be saved.

### Steps
- Mean last 24 hours of valid prices
- Calculate percentage of deviation of the newest price compared to the last 24 hour mean
- Invalidate price if devation is greater than X

## Price logging
The default method for logging prices will be JSON files. I will add support for other cold databases like MongoDB and PostgresSQL (or another SQL flavor)
