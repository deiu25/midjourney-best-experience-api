const { axiosInstance } = require("../utils/axiosConfig");
const { setCache, getCache } = require("../utils/fileCache");

// Function to enter a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getTaskDetails = async (req, res) => {
  const { task_id } = req.query;
  if (!task_id) {
    return res.status(400).json({ error: "Missing task_id" });
  }

  console.log("Fetching details for task_id:", task_id);

  // Check if there is already a cached response
  const cachedResponse = getCache(task_id);
  if (cachedResponse) {
    if (Date.now() < cachedResponse.expires) {
      console.log("Returning cached response for task_id:", task_id);
      return res.json(cachedResponse.data);
    } else {
      console.log("Cache expired for task_id:", task_id);
    }
  }

  const options = {
    method: "GET",
    url: "https://midjourney-best-experience.p.rapidapi.com/mj/get-task-id",
    params: { task_id: task_id },
  };

  let attempts = 0;
  const maxAttempts = 5;
  const baseDelay = 1000; // 1 second

  while (attempts < maxAttempts) {
    try {
      const response = await axiosInstance.request(options);
      console.log("Task details response:", response.data);

      // We cache the response for 24 hours (86400 seconds)
      setCache(task_id, response.data, 86400);

      return res.json(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error.message);
      if (error.response && error.response.status === 429) {
        attempts++;
        const delayTime = baseDelay * Math.pow(2, attempts);
        console.error(
          `Rate limit exceeded, retrying in ${delayTime / 1000} seconds...`
        );
        await delay(delayTime);
      } else {
        console.error("Error fetching task details:", error.message);
        return res.status(500).json({ error: error.toString() });
      }
    }
  }

  res.status(429).json({ error: "Too many requests, please try again later." });
};

module.exports = { getTaskDetails };
