import React, { useState, useEffect, useContext } from "react";
// const axios = require('axios');
import axiosInstance from "../utils/axiosApi";

export default function TryLogin(authState, setAuthState) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get("/auth/user")
        .then((response) => {
          if (response.status == 200) {
            setAuthState(true);
          }
        })
        .catch((error) => {
          setError(error);
        });
    };
    if (localStorage.getItem("access_token") === null || authState) {
      return;
    }
    fetchData();
  }, []);

  return [error];
}
