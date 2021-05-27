import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import { Container, Row, Card, Col, Spinner } from "react-bootstrap";
export default function VerifyInstructions() {
  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <h1>Verification Required</h1>
              <Card>
                <Card.Body>
                  A verification link has been sent to the email you signed up
                  with, check your inbox.
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
