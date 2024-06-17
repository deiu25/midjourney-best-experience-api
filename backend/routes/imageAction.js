// routes/imageAction.js
const express = require('express');
const router = express.Router();
const imageActionController = require('../controllers/imageActionController');

router.post('/', imageActionController.handleImageAction);

module.exports = router;
