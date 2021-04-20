import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";
import AuthContext from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
export default function Logout() {
  const history = useHistory();
  const { authState, setAuthState } = React.useContext(AuthContext);
  const handleSubmit = (evt) => {
    const logout = () => {
      axiosInstance
        .delete("/auth/token")
        .then((response) => {
          if (response.status == 200) {
            localStorage.removeItem("access_token");
            setAuthState(false);
            alert("logged out");
            history.push("/");
          }
        })
        .catch((error) => {
          alert(error);
        });
    };
    logout();
  };

  return (
    <a href="#" className="nav-link active" onClick={handleSubmit}>
      Logout
    </a>
  );
}
