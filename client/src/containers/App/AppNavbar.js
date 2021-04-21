import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import Logout from "../Auth/Logout";

import AuthContext from "../../contexts/AuthContext";

export default function AppNavbar() {
  const { authState, setAuthState, userState, setUserState } = React.useContext(
    AuthContext
  );

  return (
    <Navbar bg="dark" variant="dark" expand="md" style={{ padding: "5px" }}>
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-between"
      >
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          {authState ? <Nav.Link href="/create">Create</Nav.Link> : ""}
        </Nav>
        <Nav>
          {/* login controls */}
          {authState && userState != null ? (
            <NavDropdown
              title={userState.username}
              id="collasible-nav-dropdown"
              menuAlign="right"
            >
              <NavDropdown.Item href="#action/3.2">
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Fragment>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
