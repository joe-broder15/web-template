import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";

export default function ResetPassword(props) {
  let { challenge } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (password == "" || password != confirm) {
      alert("please do not leave any fields blank");
      return;
    }

    const fetchData = () => {
      axiosInstance
        .post("/auth/reset/" + challenge, {
          password: password,
        })
        .then((response) => {
          if (response.status == 200) {
            setSuccess(true);
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
  if (success) {
    return (
      <Container>
        <Row>
          <Col>
            <Row className="justify-content-md-center">
              <Col md="8">
                <h1>Reset Succeeded</h1>
                <Card>
                  <Card.Body>
                    Your Password has been changed, you may now log in.
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Reset Password</h1>
              <Card>
                <Card.Body>
                  <Form onSubmit={(event) => handleSubmit(event)}>
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
