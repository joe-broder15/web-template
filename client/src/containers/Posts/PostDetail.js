import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import AuthContext from "../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";

export default function PostDetail(props) {
  let { postId } = useParams();
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest("/post/" + String(postId));
  const { authState, setAuthState } = React.useContext(AuthContext);
  // check errors
  if (error !== null) {
    return <div>Error: {error.message}</div>;
  }
  // wait for load
  if (!isLoaded) {
    return (
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );
  }
  // display information about a post
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1>Viewing Post {data.id}</h1>
        </div>
      </div>
      <dl class="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <dt class="col-sm-3">Title</dt>
                <dd class="col-sm-9">{data.title}</dd>

                <dt class="col-sm-3">Description</dt>
                <dd class="col-sm-9">{data.text}</dd>

                <dt class="col-sm-3">Created</dt>
                <dd class="col-sm-9">{data.created_date}</dd>

                <dt class="col-sm-3">Created By:</dt>
                <dd class="col-sm-9">{data.user}</dd>
              </div>
              {authState ? (
                // if logged in link to the edit page
                <div className="row">
                  <div class="col-sm-3">
                    <Link
                      className="btn btn-success"
                      to={"/post/edit/"+ String(postId)}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </dl>
    </div>
  );
}
