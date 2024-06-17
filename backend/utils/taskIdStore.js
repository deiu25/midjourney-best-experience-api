// utils/taskIdStore.js
const fs = require('fs');
const path = require('path');
const taskIdsFilePath = path.join(__dirname, '../task_ids/task_ids.json');

// Read `taskIds` from file
const readTaskIds = () => {
  try {
    if (fs.existsSync(taskIdsFilePath)) {
      const data = fs.readFileSync(taskIdsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading task IDs: ${error}`);
  }
  return [];
};

// Write `taskIds` to file
const writeTaskIds = (taskIds) => {
  try {
    fs.writeFileSync(taskIdsFilePath, JSON.stringify(taskIds, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing task IDs: ${error}`);
  }
};

// Add a new `taskId` to the file
const addTaskId = (taskId) => {
  if (!taskId || typeof taskId !== 'string') {
    throw new Error('Invalid task ID');
  }
  const taskIds = readTaskIds();
  if (!taskIds.includes(taskId)) {
    taskIds.push(taskId);
    writeTaskIds(taskIds);
  }
};

module.exports = { readTaskIds, addTaskId };