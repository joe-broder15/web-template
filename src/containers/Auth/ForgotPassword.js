// used to send a password reset email
import React, { useState } from "react";
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

export default function ForgotPassword() {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (email == "") {
      alert("please do not leave any fields blank");
      return;
    }

    const fetchData = () => {
      axiosInstance
        .post("/auth/requestreset", {
          email: email,
        })
        .then((result) => {
          if (result.status == 200) {
            setSuccess(true);
          } else {
            alert(result);
          }
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/verify/instructions");
          } else {
            alert(error);
          }
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
                <h1>Reset Request Sent</h1>
                <Card>
                  <Card.Body>
                    A password reset link has been sent to the email you signed
                    up with, check your inbox.
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
              <h1>Forgot Password</h1>
              <Card>
                <Card.Body>
                  <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group>
                      <Form.Label>Enter your email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
