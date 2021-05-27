import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import Post from "../../components/Posts/Post";
import { Container, Row, Col, Spinner } from "react-bootstrap";

export default function PostList() {
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest("/post");

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
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Posts</h1>
              {data.map((item) => (
                <Row className="justify-content-center">
                  <Col>
                    <Post data={item} />
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
