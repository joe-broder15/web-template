import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";

export default function Register(props) {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (
      email == "" ||
      password == "" ||
      password != confirm ||
      username == ""
    ) {
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
          if (response.status == 201) {
            alert("success");
            history.push("/verify/instructions");
          } else {
            alert(response);
          }
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    };

    fetchData();
    setLoading(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Register</h1>
              <Card>
                <Card.Body>
                  <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirm}
                        onChange={(event) => setConfirm(event.target.value)}
                      />
                    </Form.Group>
                    <br />
                    {loading ? (
                      <Spinner animation="border" role="status"></Spinner>
                    ) : (
                      <Button type="submit">Submit</Button>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
