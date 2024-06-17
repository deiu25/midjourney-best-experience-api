const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const axiosInstance = axios.create({
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'midjourney-best-experience.p.rapidapi.com'
  }
});

module.exports = { axiosInstance, FormData };
