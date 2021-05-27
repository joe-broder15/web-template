import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";
import AuthContext from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import {NavDropdown} from "react-bootstrap";
export default function Logout() {
  const history = useHistory();
  const { authState, setAuthState, userState, setUserState } = React.useContext(
    AuthContext
  );
  const handleSubmit = (evt) => {
    const logout = () => {
      axiosInstance
        .delete("/auth/token")
        .then((response) => {
          if (response.status == 200) {
            // remode local token and reset auth contexts if logout succeeds
            localStorage.removeItem("access_token");
            setAuthState(false);
            setUserState(null);
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

  return <NavDropdown.Item onClick={handleSubmit}>Logout</NavDropdown.Item>;
}
