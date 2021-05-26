import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
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
} from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

export default function UserAdminSettingsBasic(props) {
  let { userName } = useParams();
  let history = useHistory();
  const [isAdmin, setAdmin] = useState(false);
  const { authState, setAuthState, userState, setUserState } =
    React.useContext(AuthContext);
  const { data, error, isLoaded } = GetApiRequest("/auth/user/" + userName);
  const isMounted = useRef(1);

  // component did mount
  useEffect(() => {
    isMounted.current = 1;
    return () => {
      isMounted.current = 0;
    };
  });

  const refreshState = () => {
    if (isLoaded && isMounted) {
      setAdmin(data.privilege > 1);
    }
  };

  // set initial state when data loads
  useEffect(() => {
    refreshState();
  }, [isLoaded]);

  // handles edit
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const editData = () => {
      axiosInstance
        .put("auth/user/privilege/" + userName, {
          privilege: isAdmin ? 2 : 1,
        })
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
        <h2>Edit Profile</h2>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form.Check
            type="checkbox"
            value={isAdmin}
            checked={isAdmin}
            onChange={(event) => setAdmin(!isAdmin)}
            label={"Administrator"}
          />
          <br />
          <Button type="submit">Submit</Button>
        </Form>
        <Button variant="warning" onClick={refreshState}>
          Clear Changes
        </Button>
      </Card.Body>
    </Card>
  );
}
