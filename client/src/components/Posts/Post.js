import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GetApiRequest from "../../hooks/GetApiRequest";

export default function Post(props) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          <Link to={"/post/" + props.data.id}>{props.data.title + props.data.id}</Link>
        </h5>
        <p className="card-text">{props.data.text}</p>
      </div>
    </div>
  );
}
