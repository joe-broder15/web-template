// admin only list of all registered users

import React, { useState, useEffect, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import GetApiRequest from "../../hooks/GetApiRequest";
import { Container, Row, Card, Col, Spinner, ListGroup } from "react-bootstrap";
import UserLink from "../../components/Users/UserLink";

export default function AdminPosts(props) {
  let history = useHistory();
  const { authState, setAuthState, userState, setUserState } =
    React.useContext(AuthContext);
  const isMounted = useRef(1);

  // get all users from api
  const { data, error, isLoaded } = GetApiRequest("/user");

  // component did mount
  useEffect(() => {
    isMounted.current = 1;
    if (!authState || userState == null || userState.privilege <= 1) {
      history.push("/");
    }
    return () => {
      isMounted.current = 0;
    };
  });
  
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
              <h1>Admin Users</h1>
              <Card>
                <Card.Body>
                  {data.length == 0 ? (
                    <h4>This user hasn't made any posts yet...</h4>
                  ) : (
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col sm="3">
                            <b>Username</b>
                          </Col>
                          <Col sm="3">
                            <b>Name</b>
                          </Col>
                          <Col sm="3">
                            <b>Birthday</b>
                          </Col>
                          <Col sm="3">
                            <b>Gender</b>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {data.map((item) => (
                        <ListGroup.Item>
                          <Row>
                            <Col sm="3">
                              <UserLink user={item.username} />
                            </Col>
                            <Col sm="3">{item.name}</Col>
                            <Col sm="3">{item.gender}</Col>
                            <Col sm="3">{item.birthday}</Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
