import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAction } from "../contexts/ActionContext";
import Loader from "./Loader";

function Create() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("relax");
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { handleAction, actionImages, loading: actionLoading } = useAction();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting prompt:", prompt);
    console.log("Mode:", mode);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-image",
        { prompt, mode }
      );
      console.log("API response:", response.data);
      setImages((prevImages) => [...prevImages, response.data.image]);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (actionImages) {
      console.log("Action images updated:", actionImages);
    }
  }, [actionImages]);

  const renderActionButtons = (actions, imageId, mode) => {
    return actions.map((action, idx) => {
      const isUpsample = action.startsWith("upsample");
      const actionNumber = action.slice(-1);
      const buttonText = isUpsample ? `U${actionNumber}` : `V${actionNumber}`;

      return (
        <button
          key={idx}
          onClick={() => handleAction(action, imageId, mode)}
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
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      {(loading || actionLoading) && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="w-full max-w-2xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-purple-400 text-center">
          Generate Image
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full mb-8 p-6 bg-gray-800 shadow-md rounded-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-300 text-lg font-semibold mb-2">
              Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border border-gray-700 rounded-lg w-full h-40 px-3 py-2 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y"
              rows="4"
            />
          </div>
          <div className="mb-4 flex items-center space-x-4">
            <label className="text-gray-300 text-lg font-semibold">Mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border border-gray-700 rounded-lg px-3 py-2 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="relax">Relax</option>
              <option value="fast">Fast</option>
            </select>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Generate
            </button>
          </div>
        </form>
        {(images.length > 0 || actionImages.length > 0) && (
          <>
            <h2 className="text-xl font-bold mb-4 text-purple-400">Generated Images:</h2>
            <div className="w-full">
              {images.map((image, index) => (
                <div key={index} className="text-center mb-4">
                  <img
                    src={image.url}
                    alt="Generated"
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="mt-2">
                    {renderActionButtons(image.actions, image.image_id, mode)}
                  </div>
                </div>
              ))}
              {actionImages && actionImages.map((image, index) => (
                <div key={index + images.length} className="text-center mb-4">
                  <img
                    src={image.url}
                    alt="Generated"
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="mt-2">
                    {renderActionButtons(image.actions, image.imageId, mode)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Create;