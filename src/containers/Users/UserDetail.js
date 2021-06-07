import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import AuthContext from "../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";
import UserPosts from "./UserPosts";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
  Jumbotron,
  Image,
} from "react-bootstrap";
import { Fragment } from "react";

export default function UserDetail(props) {
  let { userName } = useParams();
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest("/user/" + String(userName));
  const { authState, setAuthState, userState } = React.useContext(AuthContext);
  // check errors
  if (error !== null) {
    return <div>Error: {error.message}</div>;
  }
  // wait for load
  if (!isLoaded) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only"></span>
      </Spinner>
    );
  }
  // display information about a post
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <Row>
            <Col md="auto">
              <img
                src={
                  data.avatar == null
                    ? "/default_avatar.jpg"
                    : new URL(
                        data.avatar
                      )
                }
                style={{
                  width: "120px",
                  height: "120px",
                  padding: "0px",
                }}
              />
            </Col>
            <Col md="auto">
              <h1>{data.username}</h1>
              <p>{data.name}</p>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <Row className="justify-content-between">
                <Col xs="auto">Information</Col>
                <Col xs="auto">
                  {authState &&
                  userState != null &&
                  (data.username == userState.username ||
                    userState.privilege > 1) ? (
                    <Link to={"/user/" + userName + "/edit"}>
                      <Button>Edit</Button>
                    </Link>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col sm="2">
                      <b>Username:</b>
                    </Col>
                    <Col>{data.username}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm="2">
                      <b>Name:</b>
                    </Col>
                    <Col>{data.name}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col sm="2">
                      <b>Bio:</b>
                    </Col>
                    <Col>{data.bio}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm="2">
                      <b>Birthday:</b>
                    </Col>
                    <Col>{data.birthday}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm="2">
                      <b>Gender:</b>
                    </Col>
                    <Col>{data.gender}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <br />

          {data.private ? (
            <h1>This account's posts are private</h1>
          ) : (
            <UserPosts user={data.username} />
          )}
        </Col>
      </Row>
    </Container>
  );
}
