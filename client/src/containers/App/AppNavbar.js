import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import Logout from "../Auth/Logout";

import AuthContext from "../../contexts/AuthContext";

export default function AppNavbar() {
  const { authState, setAuthState, userState, setUserState } = React.useContext(
    AuthContext
  );

  return (
    <Navbar bg="dark" variant="dark" expand="md" style={{ padding: "5px" }}>
      <Navbar.Brand href="/">Web Template</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-between"
      >
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
          {authState ? (
            <Nav.Link>
              <Link to="/create">Create</Link>
            </Nav.Link>
          ) : (
            ""
          )}
        </Nav>
        <Nav>
          {/* login controls */}
          {authState && userState != null ? (
            <NavDropdown
              title={userState.username}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.2">
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Fragment>
              <Nav.Link>
                <Link to="/login">Login</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/register">Register</Link>
              </Nav.Link>
            </Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
