import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";

import GetApiRequest from "../../hooks/GetApiRequest";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  Spinner,
  Image,
} from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

export default function UserEditAvatar(props) {
  let { userName } = useParams();
  let history = useHistory();
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");

  const { data, error, isLoaded } = GetApiRequest("/user/" + String(userName));
  const isMounted = useRef(1);

  // component did mount
  useEffect(() => {
    isMounted.current = 1;
    return () => {
      isMounted.current = 0;
    };
  });

  //   used to refresh state
  const refreshState = () => {
    if (isLoaded && isMounted) {
      setAvatar(data.avatar);
    }
  };

  // set initial state when data loads
  useEffect(() => {
    refreshState();
  }, [isLoaded]);

  // handles upload
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (avatar == "") {
      alert("please do not leave any fields blank");
      return;
    }
    const editData = () => {
      let form_data = new FormData();
      form_data.append("file", avatar);
      form_data.append("filename", avatar.name);
      axiosInstance
        .post("/upload/avatar/" + userName, form_data)
        .then((response) => {
          if (response.status == 200) {
            alert("success");
          } else {
            alert("fail");
          }
          history.push("/user/" + data.username);
        })
        .catch((error) => {
          alert(error);
        });
    };
    editData();
  };

  // wait for load
  if (!isLoaded) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only"></span>
      </Spinner>
    );
  }
  return (
    <Card>
      <Card.Header>
        <h2>Edit Avatar</h2>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form>
            <Form.File
              id="custom-file"
              label="Upload a new avatar"
              custom
              onChange={(event) => {
                setAvatar(event.target.files[0]);
                setPreview(URL.createObjectURL(event.target.files[0]));
              }}
            />
          </Form>
          <Image
            src={preview}
            style={{
              width: "120px",
              height: "120px",
              padding: "0px",
            }}
          />
          <br />
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
