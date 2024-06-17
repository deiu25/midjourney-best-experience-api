// routes/homeImageAction.js
const express = require('express');
const router = express.Router();
const homeImageActionController = require('../controllers/homeImageActionController');

router.post('/', homeImageActionController.handleHomeImageAction);

module.exports = router;
