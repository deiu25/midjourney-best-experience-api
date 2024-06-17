//utils/fileCache.js
const fs = require('fs');
const path = require('path');
const cacheDir = path.join(__dirname, '../cache');

// Create cache directory if it does not exist
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const getCacheFilePath = (key) => path.join(cacheDir, `${key}.json`);

const setCache = (key, data, ttl) => {
  const filePath = getCacheFilePath(key);
  const expires = Date.now() + ttl * 1000; 
  const cacheData = { expires, data };

  fs.writeFile(filePath, JSON.stringify(cacheData), (err) => {
    if (err) {
      console.error('Error writing cache file:', err);
    }
  });
};

const getCache = (key) => {
  const filePath = getCacheFilePath(key);

  if (fs.existsSync(filePath)) {
    const cacheData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return cacheData;
  }

  return null;
};

module.exports = { setCache, getCache };
