// admin only list of all posts
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

  // get posts from api
  const { data, error, isLoaded } = GetApiRequest("/post");

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
              <h1>Admin Posts</h1>
              <Card>
                <Card.Body>
                  {data.length == 0 ? (
                    <h4>This user hasn't made any posts yet...</h4>
                  ) : (
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col sm="1">
                            <b>Id</b>
                          </Col>
                          <Col sm="4">
                            <b>Title</b>
                          </Col>
                          <Col sm="5">
                            <b>Date</b>
                          </Col>
                          <Col sm="2">
                            <b>User</b>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {data.map((item) => (
                        <ListGroup.Item>
                          <Row>
                            <Col sm="1">{item.id}</Col>
                            <Col sm="4">
                              <Link to={"/post/" + item.id}>{item.title}</Link>
                            </Col>
                            <Col sm="5">{item.created_date}</Col>
                            <Col sm="2">
                              <UserLink user={item.user} />
                            </Col>
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
