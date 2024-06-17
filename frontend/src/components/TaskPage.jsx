// src/components/TaskPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Loader from './Loader';

function TaskPage() {
  const [taskImages, setTaskImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const loader = useRef(null);
  const cache = useRef({});
  const retryTimeout = useRef(null);

  const fetchTaskIds = useCallback(async () => {
    if (isRateLimited) {
      return; 
    }

    try {
      const response = await axios.get('http://localhost:5000/task-ids');
      const taskIds = response.data;

      const fetchedImages = await Promise.all(taskIds.map(async (task) => {
        const { task_id, timestamp } = task;
        if (cache.current[task_id]) {
          return { ...cache.current[task_id], timestamp };
        }
        try {
          const response = await axios.get(`http://localhost:5000/get-task`, { params: { task_id } });
          const taskData = { ...response.data.data, timestamp };
          cache.current[task_id] = taskData; // Cache the response
          return taskData;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            setErrorMessage('You have made 100 requests, this is the limit per minute. Please wait a minute before trying again.');
            setIsRateLimited(true);
            clearTimeout(retryTimeout.current);
            retryTimeout.current = setTimeout(() => {
              setIsRateLimited(false);
              fetchTaskIds();
            }, 60000); // Retry after 1 minute
          }
          console.error(`Error fetching task ${task_id}:`, error);
          return null;
        }
      }));
      const filteredImages = fetchedImages.filter(image => image !== null);
      setTaskImages(filteredImages);
      setVisibleImages(filteredImages.slice(0, 4));
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setErrorMessage('You have made 100 requests, this is the limit per minute. Please wait a minute before trying again.');
        setIsRateLimited(true);
        clearTimeout(retryTimeout.current);
        retryTimeout.current = setTimeout(() => {
          setIsRateLimited(false);
          fetchTaskIds();
        }, 60000); // Retry after 1 minute
      } else {
        console.error('Error fetching task IDs:', error);
        setErrorMessage('An error occurred while fetching task IDs. Please try again later.');
      }
      setIsLoading(false);
    }
  }, [isRateLimited]);

  useEffect(() => {
    setIsLoading(true);
    fetchTaskIds();

    return () => {
      clearTimeout(retryTimeout.current);
    };
  }, [fetchTaskIds]);

  const loadMoreImages = useCallback(() => {
    const nextIndex = currentIndex + 4;
    const newVisibleImages = taskImages.slice(0, nextIndex);
    setVisibleImages(newVisibleImages);
    setCurrentIndex(nextIndex);
  }, [currentIndex, taskImages]);

  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && currentIndex < taskImages.length) {
        loadMoreImages();
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreImages, currentIndex, taskImages.length]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-purple-400">Task Images Collections</h1>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {visibleImages.map((task, index) => (
              <div key={index} className="text-center bg-gray-800 text-white rounded-lg shadow-lg p-4">
                <img src={task.image_url} alt={`Task ${index + 1}`} className="w-full h-78 object-cover rounded-md mb-4" />
                <p className="text-lg">Task ID: {task.task_id}</p>
                <p className="text-lg">Date: {task.timestamp}</p>
              </div>
            ))}
          </div>
        )}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <div ref={loader} className="loader mt-6">
          {currentIndex < taskImages.length && !isRateLimited && <Loader />}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
