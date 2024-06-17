const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const generateImage = require('./routes/generateImage');
const imageAction = require('./routes/imageAction');
const getTask = require('./routes/getTask');
const taskIds = require('./routes/taskIds');
const homeImageAction = require('./routes/homeImageAction'); // noua rută
const logRequests = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use(logRequests);
app.use(rateLimiter);

app.use('/generate-image', generateImage);
app.use('/image-action', imageAction);
app.use('/get-task', getTask);
app.use('/task-ids', taskIds);
app.use('/home-image-action', homeImageAction); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
