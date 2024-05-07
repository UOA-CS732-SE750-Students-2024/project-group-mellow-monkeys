import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Spinner,
  Image,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import styles from "./UserInfoPage.module.css";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8001";

export default function UserInfoPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    if (auth.id && auth.token) {
      setIsLoading(true);
      axios
        .get(`/user/${auth.id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          setUser({
            ...response.data.user,
            password: user.password,
            confirmPassword: user.confirmPassword,
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user data", error);
          setIsLoading(false);
        });
    }
  }, [auth.id, auth.token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCancel = () => {
    // Reset user state to its initial values when cancel is clicked
    setUser({
      name: auth.name,
      email: auth.email,
      password: "",
      confirmPassword: "",
      avatar: auth.avatar,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      (user.password && !user.confirmPassword) ||
      (!user.password && user.confirmPassword)
    ) {
      alert("Both password fields must be filled out to change the password.");
      return;
    }

    let updatedData = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    // Only add password to the update if both fields are filled
    if (
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword
    ) {
      updatedData.password = user.password;
    } else if (user.password !== user.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    axios
      .put(`/user/${auth.id}`, updatedData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(() => {
        // alert("User updated successfully!");
        setIsEditing(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to update user", error);
        alert("Failed to update user.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAvatarSelection = (index) => {
    setSelectedAvatar(index);
    setUser((prevUser) => ({
      ...prevUser,
      avatar: `/avatar${index + 1}.jpeg`,
    }));
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  console.log(auth.token);
  console.log(auth.id);

  return (
    <div className={styles.userInfoPage}>
      {!isEditing ? (
        <div className={styles.userInfoContainer}>
          <Image
            className={styles.userAvatar}
            src={user.avatar}
            alt="User avatar"
            roundedCircle
          />
          <div className={styles.userInfo}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <div >
            <Button
              className={styles.modifyButton}
              variant="primary"
              onClick={() => setIsEditing(true)}
              data-testid="modifyButton"
            >
              Modify Personal Information
            </Button>
            <Button
              className={styles.backHomeButton}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.submitForm}>
          <Form.Group controlId="formUserName">
            {/* <Form.Label>Name</Form.Label> */}
            <Form.Control className={styles.formUserName}
              type="text"
              placeholder="Enter name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group
            controlId="formUserEmail"
            // className={styles.formUserEmail}
          >
            {/* <Form.Label>Email</Form.Label> */}
            <Form.Control className={styles.formUserEmail}
              type="email"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group
            controlId="formUserPassword"
            // className={styles.formUserPassword}
          >
            {/* <Form.Label>Password</Form.Label> */}
            <Form.Control className={styles.formUserPassword}
              type="password"
              placeholder="New Password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group
            controlId="formUserConfirmPassword"
            // className={styles.formUserConfirmPassword}
          >
            {/* <Form.Label>Confirm Password</Form.Label> */}
            <Form.Control className={styles.formUserConfirmPassword}
              type="password"
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Row>
  {[...Array(15)].map((_, index) => (
    <Col key={index} xs={2} sm={2} md={2} lg={2} xl={2} className={styles.avatarGroup}>
    <Image
      src={`/avatar${index + 1}.jpeg`}
      thumbnail
      className={`${styles.avatarImage} ${
        selectedAvatar === index ? styles.selectedAvatar : ""
      }`}
      onClick={() => handleAvatarSelection(index)}
    />
  </Col>
  
  ))}
</Row>

          <Button variant="success" type="submit" className={styles.ButtonChange}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCancel} className={styles.ButtonCancel}>
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}
