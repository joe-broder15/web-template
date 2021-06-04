import React from "react";
import { Link } from "react-router-dom";

export default function UserLink(props) {
  return <Link to={"/user/" + props.user}>{props.user}</Link>;
}
