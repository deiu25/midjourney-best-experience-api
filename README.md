Image Generation Application
This project is an image generation application leveraging the "Midjourney Best Experience" API. The application allows users to generate stunning, high-quality images with ease, and provides several features for managing and utilizing these images.

<img width="961" alt="home2" src="https://github.com/deiu25/midjourney-best-experience-api/assets/109814285/1b74e85c-e389-4eef-8017-3ef0b9bfaca4">

Features
Create Image: Generate images by providing a simple prompt. Select the mode (Relax or Fast) and see the results. Once the image is generated, it can be downloaded or variations can be created.
Home Page: Search for a task using its ID (which can be found in collections), and if the image was generated within the last 24 hours (as allowed by the API), you can download the image or generate more versions.
Collections: View all generated images and their generation dates. Images are available for 2-3 days as they are not stored on the API server for longer.


<img width="961" alt="create" src="https://github.com/deiu25/midjourney-best-experience-api/assets/109814285/f022db87-7752-4b3a-b1e5-20711f0ea0f6">

Technologies Used
React: Frontend library for building the user interface.
Node.js: Backend runtime for handling server-side logic.
Tailwind CSS: Utility-first CSS framework for styling.

Installation
Clone the repository.

Install dependencies for both frontend and backend: npm install
In backend enter your api key in .env file: RAPIDAPI_KEY=YOUR_API_KEY
Start backend server: cd backend: npm run backend
Start frontend: npm start

Usage
Create Image: Navigate to the "Create" page, enter your prompt, select the mode (Relax or Fast), and click "Generate". The generated image will be displayed, and you can download it or create variations.
Home Page: On the home page, enter a task ID to fetch the generated image. If the image was generated within the last 24 hours, you can download it or generate more versions.
Collections: View all your generated images along with their generation dates. Remember, images are only stored for 2-3 days.

License
This project is licensed under the MIT License.
