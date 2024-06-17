//utils/taskIdConfig.js
const fs = require('fs');

const readTaskIdsFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
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

const writeTaskIdsToFile = (filePath, taskIds) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(taskIds, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing task_ids to file:', err.message);
    throw err;
  }
};

module.exports = {
  readTaskIdsFromFile,
  writeTaskIdsToFile
};
