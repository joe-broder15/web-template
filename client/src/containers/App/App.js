import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import PostList from "../Posts/PostList";
import PostCreate from "../Posts/PostCreate";
import PostDetail from "../Posts/PostDetail";
import PostEdit from "../Posts/PostEdit";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import UserDetail from "../Users/UserDetail";
import UserEdit from "../Users/UserEdit";
import AppNavbar from "./AppNavbar";
import LoginHook from "../../hooks/LoginHook";

import AuthContext from "../../contexts/AuthContext";

export default function App() {
  const [authState, setAuthState] = useState(false);
  const [userState, setUserState] = useState(null);
  LoginHook(authState, setAuthState, userState, setUserState);
  // check if a token exists in memory, if so log in

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, userState, setUserState }}
    >
      <Router>
        <AppNavbar />
        <div>
          <Switch>
            <Route path="/post">
              <PostRoutes />
            </Route>
            <Route path="/user">
              <UserRoutes />
            </Route>
            <Route path="/create">
              <PostCreate />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <PostList />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

function PostRoutes() {
  let match = useRouteMatch();
  let { id } = useParams();
  return (
    <Switch>
      <Route path={`${match.path}/:postId/edit`}>
        <PostEdit />
      </Route>
      <Route path={`${match.path}/:postId`}>
        <PostDetail />
      </Route>

      <Route path={match.path}></Route>
    </Switch>
  );
}

function UserRoutes() {
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:userName/edit`}>
        <UserEdit />
      </Route>
      <Route path={`${match.path}/:userName`}>
        <UserDetail />
      </Route>
      <Route path={match.path}>g</Route>
    </Switch>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}
