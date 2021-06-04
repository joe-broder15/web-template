import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import GetApiRequest from "../../hooks/GetApiRequest";
import UserEditBasic from "./UserEditBasic";
import UserEditAvatar from "./UserEditAvatar";
import UserCredentials from "./UserCredentials";
import UserAdminSettings from "./UserAdminSettings";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  ListGroup,
  Button,
  Spinner,
  Nav,
} from "react-bootstrap";

export default function UserEdit(props) {
  let { userName } = useParams();
  let history = useHistory();
  const { authState, userState } = React.useContext(AuthContext);

  let [editType, setEditType] = useState(1);

  function renderSwitch(param) {
    switch (editType) {
      case 1:
        return <UserEditBasic />;
      case 2:
        return <UserCredentials />;
      case 3:
        return <UserEditAvatar />;
      case 4:
        return <UserAdminSettings />;
    }
  }

  useEffect(() => {
    if (
      !authState ||
      userState == null ||
      (userName != userState.username && userState.privilege <= 1)
    ) {
      history.push("/");
    }
  });

  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="8">
              <Row>
                <Col md="2">
                  <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link onClick={() => setEditType(1)}>Profile</Nav.Link>
                    <Nav.Link onClick={() => setEditType(2)}>
                      Credentials
                    </Nav.Link>
                    <Nav.Link onClick={() => setEditType(3)}>Avatar</Nav.Link>
                    {userState != null && userState.privilege > 1 ? (
                      <Nav.Link onClick={() => setEditType(4)}>Admin</Nav.Link>
                    ) : (
                      ""
                    )}
                  </Nav>
                </Col>
                <Col>{renderSwitch(editType)}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
