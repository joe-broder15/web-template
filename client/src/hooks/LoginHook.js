import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosApi";

export default function TryLogin(authState, setAuthState, userState, setUserState) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get("/auth/user")
        .then((response) => {
          if (response.status == 200) {
            setAuthState(true);
            setUserState(response.data);
            console.log(response.data)
          }
        })
        .catch((error) => {
          setError(error);
        });
    };
    if (localStorage.getItem("access_token") === null || (authState == true && userState!=null)) {
      return;
    }
    fetchData();
  }, [authState, userState]);

  return [error];
}
