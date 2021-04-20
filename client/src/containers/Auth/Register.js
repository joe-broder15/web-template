import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";

export default function Register(props) {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (email == "" || password == "" || password != confirm || username =="") {
      alert("please do not leave any fields blank");
      return;
    }

    const fetchData = () => {
      axiosInstance
        .post("/auth/user", {
          username: username,
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response);
          if (response.status == 201) {
            alert("success");
            history.push("/");
          } else {
            alert(response);
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
          <h1>Register</h1>
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
              <label for="exampleFormControlInput1" class="form-label">
                Username
              </label>
              <input
                class="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
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
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">
                Confirm Password
              </label>
              <input
                class="form-control"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
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
