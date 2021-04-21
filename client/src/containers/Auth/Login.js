import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
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
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Login</h1>
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
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </Form.Group>
                    <br />
                    <Button type="submit">Submit</Button>
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
