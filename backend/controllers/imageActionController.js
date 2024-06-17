//controllers/imageActionController.js
const { makeApiRequest } = require('../utils/apiHelper');

const handleImageAction = async (req, res) => {
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
    const image = await makeApiRequest(url, params, cacheKey);
    console.log("Image URL from action API:", image.imageUrl);
    res.json(image);
  } catch (error) {
    console.error('Error during API request:', error.message, error.stack);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { handleImageAction };
