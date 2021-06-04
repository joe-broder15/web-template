// the page linked in a verification email
import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Spinner,
  Form,
  Button,
} from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";

export default function EmailVerify(props) {
  let { challenge } = useParams();

  // verify email with the current route
  const { data, error, isLoaded } = GetApiRequest("/auth/verify/" + challenge);

  if (error !== null) {
    return <div>Verification failed: {error.message}</div>;
  }
  // wait for load
  if (!isLoaded) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only"></span>
      </Spinner>
    );
  }
  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Success</h1>
              <Card>
                <Card.Body>
                  Your email has been sucesfully verified, you may log in
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
