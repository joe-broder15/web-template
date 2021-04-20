import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";

export default function Login() {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authState, setAuthState } = React.useContext(AuthContext);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (email == "" || password == "") {
      alert("please do not leave any fields blank");
      return;
    }

    const fetchData = () => {
      axiosInstance
        .post("/auth/token", {
          email: email,
          password: password,
        })
        .then((result) => {
          if (result.status == 202) {
            alert("success");
            axiosInstance.defaults.headers["Authorization"] =
              "JWT " + result.data;
            localStorage.setItem("access_token", result.data);
            // set global authentication state
            setAuthState(true);
            history.goBack();
          } else {
            alert(result);
          }
        })
        .catch((error) => {
          alert(error);
        });
    };
    fetchData();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 ">
          <h1>Login</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8 ">
          <form onSubmit={(event) => handleSubmit(event)}>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Email
              </label>
              <input
                class="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">
                Password
              </label>
              <input
                class="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
