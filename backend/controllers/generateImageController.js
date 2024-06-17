const { axiosInstance, FormData } = require('../utils/axiosConfig');
const cache = require('../utils/cache');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const taskIdsFilePath = path.join(__dirname, '../task_ids/task_ids.json');

const readTaskIdsFromFile = () => {
  try {
    const data = fs.readFileSync(taskIdsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    } else {
      console.error('Error reading task_ids from file:', err.message);
      throw err;
    }
  }
};

const writeTaskIdsToFile = (taskIds) => {
  try {
    fs.writeFileSync(taskIdsFilePath, JSON.stringify(taskIds, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing task_ids to file:', err.message);
    throw err;
  }
};

const generateImage = async (req, res) => {
  const { prompt, mode } = req.body;
  console.log('Received prompt:', prompt);
  console.log('Mode:', mode);

  const cacheKey = `${prompt}-${mode}`;

  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const data = new FormData();
  const url = mode === 'fast' ? 'https://midjourney-best-experience.p.rapidapi.com/mj/generate-fast' : 'https://midjourney-best-experience.p.rapidapi.com/mj/generate-relax';

  const options = {
    method: 'POST',
    url: url,
    params: { prompt, hook_url: 'https://www.google.com' },
    headers: { ...data.getHeaders() },
    data: data
  };

  try {
    const response = await axiosInstance.request(options);
    const taskId = response.data.data.task_id;
    console.log('Generated task_id:', taskId);

    const pollTaskStatus = async () => {
      const pollOptions = {
        method: 'GET',
        url: 'https://midjourney-best-experience.p.rapidapi.com/mj/get-task-id',
        params: { task_id: taskId }
      };

      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 20000));
        const pollResponse = await axiosInstance.request(pollOptions);
        console.log('Polling task_id:', taskId, 'Poll response:', pollResponse.data);
        if (pollResponse.data.data && pollResponse.data.data.image_url) {
          return {
            url: pollResponse.data.data.image_url,
            image_id: pollResponse.data.data.image_id,
            actions: pollResponse.data.data.actions
          };
        }
      }
      return null;
    };

    const image = await pollTaskStatus();
    if (image) {
      const timestamp = moment().format('DD.MM.YYYY HH:mm');
      const taskIds = readTaskIdsFromFile();
      taskIds.push({ task_id: taskId, timestamp: timestamp });
      writeTaskIdsToFile(taskIds);

      cache.set(cacheKey, { image });
      res.json({ image });
    } else {
      res.status(500).json({ error: 'Image generation failed or took too long.' });
    }
  } catch (error) {
    console.error('Error during API request:', error.message);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { generateImage };
