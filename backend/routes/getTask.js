//routes/getTask.js
const express = require('express');
const router = express.Router();
const getTaskController = require('../controllers/getTaskController');

router.get('/', getTaskController.getTaskDetails);

module.exports = router;
