import React, { useState, useEffect } from "react";
import GetApiRequest from "../../hooks/GetApiRequest";
import Post from "../../components/Posts/Post";

export default function PostList() {
  // get posts using our GET api hook
  const { data, error, isLoaded } = GetApiRequest(
    "/post"
  );

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
  // render a Post for each item
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1>Posts</h1>
        </div>
      </div>
      {data.map((item) => (
        <div className="row justify-content-center">
          <div className="col-lg-8 ">
            <Post data={item} />
          </div>
        </div>
      ))}
    </div>
  );
}
