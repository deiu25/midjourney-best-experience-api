//routes/taskids.js
const express = require('express');
const router = express.Router();
const taskIdsController = require('../controllers/taskIdsController');
const rateLimiter = require('../middleware/rateLimiter');

router.get('/', rateLimiter, taskIdsController.getTaskIds);

module.exports = router;

