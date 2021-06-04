import React, { Fragment, useState, useEffect } from "react";
import {
  HashRouter as Router,
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
import AdminPosts from "../Admin/AdminPosts";
import AdminUsers from "../Admin/AdminUsers";
import EmailVerify from "../Auth/EmailVerify";
import VerifyInstructions from "../Auth/VerifyInstructions";

import AuthContext from "../../contexts/AuthContext";
import ForgotPassword from "../Auth/ForgotPassword";
import ResetPassword from "../Auth/ResetPassword";

export default function App() {
  const [authState, setAuthState] = useState(false);
  const [userState, setUserState] = useState(null);

  // check if a token exists in memory, if so log in
  LoginHook(authState, setAuthState, userState, setUserState);

  return (
    // set up contexts
    <AuthContext.Provider
      value={{ authState, setAuthState, userState, setUserState }}
    >
      {/* routes */}
      <Router basename="/">
        <AppNavbar />
        <div>
          <Switch>
            <Route exact path="/">
              <PostList />
            </Route>
            <Route path="/reset/:challenge">
              <ResetPassword />
            </Route>
            <Route path="/verify/instructions">
              <VerifyInstructions />
            </Route>
            <Route path="/verify/confirm/:challenge">
              <EmailVerify />
            </Route>
            <Route path="/admin">
              <AdminRoutes />
            </Route>
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
            <Route path="/forgotpassword">
              <ForgotPassword />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

// sub routes for posts
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

// sub routes for users
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

// sub routes for admins
function AdminRoutes() {
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/posts`}>
        <AdminPosts />
      </Route>
      <Route path={`${match.path}/users`}>
        <AdminUsers />
      </Route>
      <Route path={match.path}>g</Route>
    </Switch>
  );
}
