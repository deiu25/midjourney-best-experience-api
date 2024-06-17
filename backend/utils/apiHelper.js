// utils/apiHelper.js
const { axiosInstance, FormData } = require("./axiosConfig");
const cache = require("./cache");
const moment = require("moment");

const makeApiRequest = async (url, params, cacheKey) => {
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  const data = new FormData();
  const options = {
    method: "POST",
    url: url,
    params: params,
    headers: { ...data.getHeaders() },
    data: data,
  };

  try {
    const response = await axiosInstance.request(options);
    const taskId = response.data.data.task_id;

    const pollTaskStatus = async () => {
      const pollOptions = {
        method: "GET",
        url: "https://midjourney-best-experience.p.rapidapi.com/mj/get-task-id",
        params: { task_id: taskId },
      };

      for (let i = 0; i < 50; i++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const pollResponse = await axiosInstance.request(pollOptions);
        if (pollResponse.data.data && pollResponse.data.data.image_url) {
          return {
            imageUrl: pollResponse.data.data.image_url,
            actions: pollResponse.data.data.actions,
            imageId: pollResponse.data.data.image_id,
          };
        }
      }
      return null;
    };

    const image = await pollTaskStatus();
    if (image) {
      cache.set(cacheKey, image);
      return image;
    } else {
      throw new Error("Image generation/action failed or took too long.");
    }
  } catch (error) {
    console.error("Error during API request:", error.message, error.stack);
    throw error;
  }
};

module.exports = { makeApiRequest };
