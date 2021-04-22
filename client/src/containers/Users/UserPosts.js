import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import Post from "../../components/Posts/Post";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card, ListGroup } from "react-bootstrap";

export default function UserPosts(props) {
  const user = props.user;
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest("/post/user/" + user);

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
  // render a Post for each item
  return (
    <Card>
      <Card.Header>Posts by {user}</Card.Header>
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
                <Col sm="7">
                  <b>Title</b>
                </Col>
                <Col sm="4">
                  <b>Date</b>
                </Col>
              </Row>
            </ListGroup.Item>
            {data.map((item) => (
              <ListGroup.Item>
                <Link to={"/post/" + item.id}>
                  <Row>
                    <Col sm="1">{item.id}</Col>
                    <Col sm="7">{item.title}</Col>
                    <Col sm="4">{item.created_date}</Col>
                  </Row>
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
