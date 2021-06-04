import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosApi";
import { useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import GetApiRequest from "../../hooks/GetApiRequest";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

export default function UserEditBasic(props) {
  let { userName } = useParams();
  let history = useHistory();
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(false);

  const [confirm, setConfirm] = useState(false);
  const { authState, setAuthState, userState, setUserState } =
    React.useContext(AuthContext);
  const { data, error, isLoaded } = GetApiRequest("/user/" + String(userName));
  const isMounted = useRef(1);

  // component did mount
  useEffect(() => {
    isMounted.current = 1;
    return () => {
      isMounted.current = 0;
    };
  });

  const refreshState = () => {
    if (isLoaded && isMounted) {
      setAvatar(data.avatar);
      setBio(data.bio);
      setBirthday(data.birthday);
      setGender(data.gender);
      setName(data.name);
      setPrivate(data.private);
    }
  };

  // set initial state when data loads
  useEffect(() => {
    refreshState();
  }, [isLoaded]);

  // handles edit
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (bio == "" || name == "" || confirm == false) {
      alert("please do not leave any fields blank");
      return;
    }
    const editData = () => {
      axiosInstance
        .put("/user/" + userName, {
          username: userName,
          name: name,
          bio: bio,
          gender: gender,
          private: isPrivate,
          birthday: String(birthday),
        })
        .then((response) => {
          if (response.status == 200) {
            alert("success");
          } else {
            alert("fail");
          }
          history.push("/user/" + data.username);
        })
        .catch((error) => {
          alert(error);
        });
    };
    editData();
  };

  // handles delete
  const handleDelete = () => {
    const deleteData = () => {
      axiosInstance
        .delete("/user/" + userName)
        .then((response) => {
          if (response.status == 200) {
            localStorage.removeItem("access_token");
            setAuthState(false);
            setUserState(null);
            alert("account deleted");
            history.push("/");
          } else {
            alert("fail");
          }
        })
        .catch((error) => {
          alert(error);
        });
    };
    deleteData();
  };

  // wait for load
  if (!isLoaded) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only"></span>
      </Spinner>
    );
  }
  return (
    <Card>
      <Card.Header>
        <h2>Edit Profile</h2>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows="9"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Control
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Check
              type="checkbox"
              value={isPrivate}
              checked={isPrivate}
              onChange={(event) => setPrivate(!isPrivate)}
              label={"Private"}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              placeholder="Date of Birth"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Check
            type="checkbox"
            value={confirm}
            checked={confirm}
            onChange={(event) => setConfirm(!confirm)}
            label={"Confirm"}
          />
          <br />
          <Button type="submit">Submit</Button>
        </Form>
        <Button variant="warning" onClick={refreshState}>
          Clear Changes
        </Button>
        <br />
        <Button variant="danger" onClick={handleDelete}>
          Delete Account
        </Button>
      </Card.Body>
    </Card>
  );
}
