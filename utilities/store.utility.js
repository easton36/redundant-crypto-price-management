const fs = require('fs');
const path = require('path');

// Get data from store file
const getStoreData = (fileName) => {
	const dataPath = path.join(__dirname, `../data/${fileName}.json`);

	return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

// Add new log to the store and save to disk
const addStoreLog = (fileName, log) => {
	const currentData = getStoreData(fileName);

	currentData.push(log);

	const dataPath = path.join(__dirname, `../data/${fileName}.json`);

	fs.writeFileSync(dataPath, JSON.stringify(currentData));

	return currentData;
};

// Filter data array to just logs from the last 24 hours
const filterLast24Hours = (data) => {
	const now = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

	return data.filter(item => new Date(item.timestamp).getTime() > now);
};