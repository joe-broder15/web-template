import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import AuthContext from "../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import UserLink from "../../components/Users/UserLink";
export default function PostDetail(props) {
  let { postId } = useParams();
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest("/post/" + String(postId));
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
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Viewing Post {data.id}</h1>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col sm="2">
                          <b>Title:</b>
                        </Col>
                        <Col>{data.title}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col sm="2">
                          <b>Description:</b>
                        </Col>
                        <Col>{data.text}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col sm="2">
                          <b>Created at:</b>
                        </Col>
                        <Col>{data.created_date}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col sm="2">
                          <b>Author:</b>
                        </Col>
                        <Col>
                          <UserLink user={data.user} />
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              <br />
              {authState &&
              userState != null &&
              (userState.username == data.user || userState.privilege > 1) ? (
                // if logged in link to the edit page
                <Row>
                  <Col sm="2">
                    <Link to={"/post/" + String(postId) + "/edit"}>
                      <Button>Edit</Button>
                    </Link>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
