// controllers/homeImageActionController.js
const { makeApiRequest } = require('../utils/apiHelper');

const handleHomeImageAction = async (req, res) => {
  const { action, image_id, mode } = req.body;
  if (!mode) {
    return res.status(400).json({ error: 'Mode is required.' });
  }
  console.log('Received action:', action, 'for image_id:', image_id, 'with mode:', mode);

  const cacheKey = `${action}-${image_id}-${mode}`;
  const url = mode === 'fast'
    ? 'https://midjourney-best-experience.p.rapidapi.com/mj/action-fast'
    : 'https://midjourney-best-experience.p.rapidapi.com/mj/action-relax';
  const params = { action, image_id, hook_url: 'https://www.google.com' };

  try {
    console.log('Making API request to:', url);
    console.log('Request params:', params);

    const image = await makeApiRequest(url, params, cacheKey);

    console.log("Image URL from action API:", image.imageUrl);
    console.log("Response actions:", image.actions);
    console.log("Response imageId:", image.imageId);

    res.json(image);
  } catch (error) {
    console.error('Error during API request:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.toString() });
    }
  }
};

module.exports = { handleHomeImageAction };
