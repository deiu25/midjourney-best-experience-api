//utils/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // TTL = 600 seconds, check period = 120 seconds

module.exports = cache;
