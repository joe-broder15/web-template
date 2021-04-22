import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import UserLink from "../Users/UserLink";

export default function Post(props) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Link to={"/post/" + props.data.id}>
            {props.data.title + " " + props.data.id}
          </Link>
        </Card.Title>
        <Card.Text>{props.data.text}</Card.Text>
        <Card.Text>
          <i>Made By: <UserLink user={props.data.user}/></i>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
