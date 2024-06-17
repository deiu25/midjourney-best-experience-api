//contexts/ActionContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ActionContext = createContext();

export const useAction = () => useContext(ActionContext);

export const ActionProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [actionImages, setActionImages] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleAction = async (action, imageId, mode) => {
    setLoading(true);
    console.log(`Performing ${action} on image ${imageId} with mode ${mode}`);
    try {
      const response = await axios.post("http://localhost:5000/image-action", {
        action,
        image_id: imageId,
        mode
      });
      console.log("Action API response:", response.data);
      if (response.data && response.data.imageUrl && response.data.actions) {
        setActionImages(prevImages => [
          ...prevImages,
          {
            url: response.data.imageUrl,
            actions: response.data.actions,
            imageId: response.data.imageId,
          }
        ]);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error performing action:", error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };

  return (
    <ActionContext.Provider value={{ handleAction, images, actionImages, loading }}>
      {children}
    </ActionContext.Provider>
  );
};

