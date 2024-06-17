//routes/generateImage.js
const express = require('express');
const router = express.Router();
const generateImageController = require('../controllers/generateImageController');

router.post('/', generateImageController.generateImage);

module.exports = router;
