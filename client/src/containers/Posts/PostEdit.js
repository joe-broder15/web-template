import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import GetApiRequest from "../../hooks/GetApiRequest";
import { useParams } from "react-router-dom";
const axios = require("axios");
export default function PostEdit(props) {
  let { postId } = useParams();
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirm, setConfirm] = useState(false);
  const { authState, setAuthState } = React.useContext(AuthContext);
  const { data, error, isLoaded } = GetApiRequest("/post/" + String(postId));
  const isMounted = useRef(1);

  // component did mount
  useEffect(() => {
    isMounted.current = 1;
    if (!authState) {
      history.push("/");
    }
    return () => {
      isMounted.current = 0;
    };
  });

  const refreshState = () => {
    if (isLoaded && isMounted) {
      setTitle(data.title);
      setDescription(data.text);
    }
  };

  // set initial state when data loads
  useEffect(() => {
    refreshState();
  }, [data, isLoaded]);

  // handles edit
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (title == "" || description == "" || confirm == false) {
      alert("please do not leave any fields blank");
      return;
    }

    const editData = () => {
      axiosInstance
        .put("/post/" + String(data.id), {
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
          history.push("/post/" + data.id);
        })
        .catch((error) => {
          alert(error);
        });
    };
    editData();
  };

  // handles delete
  const handleDelete = () => {
    const deleteData = () => {
      axiosInstance
        .delete("/post/" + String(data.id))
        .then((response) => {
          // setIsLoaded(true);
          if (response.status == 200) {
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
    deleteData();
  };

  // wait for load
  if (!isLoaded) {
    return (
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 ">
          <h1>Edit Post {data.id}</h1>
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
          <button className="btn btn-warning" onClick={refreshState}>
            Reset
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
