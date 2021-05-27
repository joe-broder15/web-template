import React, { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosApi";

export default function GetApiRequest(url) {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get(url)
        .then((response) => {
          
          setData(response.data);
          setIsLoaded(true);
        })
        .catch((error) => {
          setError(error);
        });
    };
    fetchData();
  }, [url]);

  return { error, isLoaded, data };
};
