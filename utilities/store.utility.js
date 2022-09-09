const fs = require('fs');
const path = require('path');

// Get data from store file
const getStoreData = (filePath) => {
	const dataPath = path.resolve(filePath);

	return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

// Add new log to the store and save to disk
const addStoreLog = (filePath, log) => {
	const currentData = getStoreData(filePath);

	currentData.push(log);

	const dataPath = path.resolve(filePath);

	fs.writeFileSync(dataPath, JSON.stringify(currentData));

	return currentData;
};

// Filter data array to just logs from the last 24 hours
const filterLast24Hours = (data) => {
	const now = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

	return data.filter(item => new Date(item.timestamp).getTime() > now);
};

module.exports = {
	getStoreData,
	addStoreLog,
	filterLast24Hours
};