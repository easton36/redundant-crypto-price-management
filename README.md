# redundant-crypto-price-management
Library for tracking crypto prices from a number of sources with redundancy to prevent price manipulation errors 

## Reasoning
Coinmarketcap had a bug in late 2021 that surged the prices of all cryptocurrencies on their platform for multiple hours. Sites (most notable one that I can think of being csgoempire.com) that relied on them for accurate crypto prices to manage things like deposits and withdrawals (in amounts of fiat currency and not crypto) lost major amounts of money. 

Robust systems cannot rely on a single point of failure.
