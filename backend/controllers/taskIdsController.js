const fs = require('fs'); 
const path = require('path');

const taskIdsFilePath = path.join(__dirname, '../task_ids/task_ids.json'); 

const getTaskIds = (req, res) => {
  fs.readFile(taskIdsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading task_ids file:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      const taskIds = JSON.parse(data);
      res.json(taskIds);
    } catch (parseError) {
      console.error('Error parsing task_ids file:', parseError.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

module.exports = { getTaskIds };
