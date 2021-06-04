import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { Link, useHistory } from "react-router-dom";
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
  ListGroup
} from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

export default function UserCredentials(props) {
  let { userName } = useParams();
  let history = useHistory();

  const { data, error, isLoaded } = GetApiRequest("/auth/user/"+userName);
  //   const isMounted = useRef(1);

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
        <h2>Edit Credentials</h2>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col sm="3">
                <b>Username:</b>
              </Col>
              <Col>{data.username}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col sm="3">
                <b>Email:</b>
              </Col>
              <Col>{data.email}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col sm="3">
                <b>Privilege:</b>
              </Col>
              <Col>{ + data.privilege}</Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
        <Link to="/forgotpassword">Reset Password</Link>
      </Card.Body>
    </Card>
  );
}
