import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
const axios = require("axios");
export default function PostCreate() {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirm, setConfirm] = useState(false);
  const { authState, setAuthState} = React.useContext(
    AuthContext
  )
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (title == "" || description == "" || confirm == false) {
      alert("please do not leave any fields blank");
      return;
    }

    const fetchData = () => {
      axiosInstance
        .post("/post", {
          title: title,
          text: description,
        })
        .then((response) => {
          // setIsLoaded(true);
          if (response.status == 201) {
            alert("success");
          } else {
            alert("fail");
          }
          history.push("/");
        })
        .catch((error) => {
          alert(error);
        });
    };
    fetchData();
  };

  // redirect if not authenticated
  useEffect(() => {
    if(!authState) {
      history.push("/");
    }
  })

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 ">
          <h1>Create</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8 ">
          <form onSubmit={(event) => handleSubmit(event)}>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Title
              </label>
              <input
                class="form-control"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">
                Text
              </label>
              <textarea
                class="form-control"
                rows="9"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
            </div>
            <div className="mb-3 form-check">
              <label class="form-label">Confirm</label>
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                value={confirm}
                checked={confirm}
                onChange={(event) => setConfirm(!confirm)}
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
