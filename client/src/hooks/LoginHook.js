import React, { useState, useEffect, useContext } from "react";
// const axios = require('axios');
import axiosInstance from "../utils/axiosApi";

export default function TryLogin(authState, setAuthState, userState, setUserState) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get("/auth/user")
        .then((response) => {
          if (response.status == 200) {
            setUserState(response.data);
            setAuthState(true);
          }
        })
        .catch((error) => {
          setError(error);
        });
    };
    if (localStorage.getItem("access_token") === null || (authState && userState!=null)) {
      return;
    }
    fetchData();
  }, []);

  return [error];
}
