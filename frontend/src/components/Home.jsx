import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";

const Home = () => {
  const [taskId, setTaskId] = useState("");
  const [taskDetails, setTaskDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]); 

  const handleFetchTask = async (e) => {
    e.preventDefault();
    setFetchingTask(true);
    setTaskDetails(null);
    console.log("Fetching details for task_id:", taskId);
    try {
      const response = await axios.get(`http://localhost:5000/get-task`, {
        params: { task_id: taskId },
      });
      console.log("Task details response:", response.data);
      setTaskDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setTaskDetails(null);
    }
    setFetchingTask(false);
  };

  const mode = 'relaxed'; // or 'fast', depending on your requirement

  const handleActionClick = async (action, imageId) => {
    setActionLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/home-image-action", {
        action,
        image_id: imageId,
        mode
      });
      console.log("Action API response:", response.data);
      setGeneratedImages((prevImages) => [
        ...prevImages,
        {
          url: response.data.imageUrl,
          actions: response.data.actions,
          imageId: response.data.imageId,
        },
      ]);
    } catch (error) {
      console.error("Error performing action:", error.response ? error.response.data : error.message);
    }
    setActionLoading(false);
  };

  const renderActionButtons = (actions, imageId, mode) => {
    return actions.map((action, idx) => {
      const isUpsample = action.startsWith("upsample");
      const actionNumber = action.slice(-1);
      const buttonText = isUpsample ? `U${actionNumber}` : `V${actionNumber}`;

      return (
        <button
          key={idx}
          onClick={() => handleActionClick(action, imageId)}
          className={`${
            isUpsample ? "bg-green-500" : "bg-yellow-500"
          } text-white px-2 py-1 rounded mr-2 hover:${
            isUpsample ? "bg-green-400" : "bg-yellow-400"
          } transition duration-300`}
        >
          {buttonText}
        </button>
      );
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative">
      {fetchingTask || actionLoading ? (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <Loader />
        </div>
      ) : null}
      <div className="w-full max-w-2xl px-4 py-8">
        <h2 className="text-4xl font-bold mb-6 text-purple-400 text-center">
          Fetch Task Details
        </h2>
        <form onSubmit={handleFetchTask} className="w-full mb-8">
          <label className="block text-gray-300 mb-2">Task ID:</label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="border border-gray-700 rounded-lg w-full px-3 py-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-500 transition duration-300"
          >
            Fetch Task
          </button>
        </form>
        {taskDetails && (
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Task Details:
            </h2>
            <p>Task ID: {taskDetails.task_id}</p>
            <img
              src={taskDetails.image_url}
              alt="Task Img"
              className="w-full mb-4 rounded-lg"
            />
            <div className="mt-4">
              {taskDetails.actions && renderActionButtons(taskDetails.actions, taskDetails.image_id, mode)}
            </div>
          </div>
        )}
        {generatedImages.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Generated Images:</h2>
            {generatedImages.map((image, idx) => (
              <div key={idx} className="w-full bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                <img
                  src={image.url}
                  alt={`Generated Img ${idx + 1}`}
                  className="w-full mb-4 rounded-lg"
                />
                <div className="mt-4">
                  {image.actions && renderActionButtons(image.actions, image.imageId, mode)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
