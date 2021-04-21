import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import Logout from "../Auth/Logout";

import AuthContext from "../../contexts/AuthContext";

export default function Navbar() {
  const {authState, setAuthState, userState, setUserState} = React.useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Brand
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            {authState ? (
              <Fragment>
                <li className="nav-item">
                  <Link className="nav-link active" to="/create">
                    Create
                  </Link>
                </li>
              </Fragment>
            ) : (
              ""
            )}
          </ul>
          {/* login controls */}
          <ul className=" d-flex navbar-nav">
            {authState ? (
              <Fragment>
                <li className="nav-item">
                  <Logout />
                </li>
                <li className="nav-item">
                  {userState.username}
                </li>
              </Fragment>
              
            ) : (
              <Fragment>
                <li className="nav-item">
                  <Link className="nav-link active" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/register">
                    Register
                  </Link>
                </li>
              </Fragment>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
