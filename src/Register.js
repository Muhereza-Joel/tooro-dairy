import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Schema, Button } from "rsuite";

const nameRule = Schema.Types.StringType().isRequired(
  "The username is required."
);
const emailRule = Schema.Types.StringType()
  .isEmail("Please enter a valid email address.")
  .isRequired("Email is required");
const passwordRule = Schema.Types.StringType().isRequired(
  "Password is required"
);

const Register = () => {
  const navigate = useNavigate();
  const[formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (formValue) => {
    setFormData(formValue);
  }

  const handleSubmit = async () => {
    if(!formData.username || !formData.email || !formData.password){
      return
    }
    console.log(formData);
    // navigate("/dashboard");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h3>Tooro Dairy Mangement System</h3>
      <br />
      <br />
      <Form
        layout="horizontal"
        style={{
          width: 350,
          border: "1px solid #ccc",
          padding: 20,
          borderRadius: 8,
        }}

        onChange={handleChange}
        onSubmit={handleSubmit}
        formValue={formData}
      >
        <h4 style={{ textAlign: "center" }}>Create Your Account</h4>
        <br />
        <Form.Group controlId="name-7">
          <Form.ControlLabel style={{ textAlign: "start" }}>
            Username
          </Form.ControlLabel>
          <Form.Control
            name="username"
            placeholder="Enter your username here"
            rule={nameRule}
          />
        </Form.Group>
        <Form.Group controlId="email-7">
          <Form.ControlLabel style={{ textAlign: "start" }}>
            Email
          </Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter your email here"
            rule={emailRule}
          />
        </Form.Group>
        <Form.Group controlId="password-7">
          <Form.ControlLabel style={{ textAlign: "start" }}>
            Password
          </Form.ControlLabel>
          <Form.Control
            name="password"
            type="password"
            autoComplete="off"
            placeholder="1234"
            rule={passwordRule}
          />
        </Form.Group>

        <Form.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Button
              appearance="primary"
              type="submit"
              style={{ marginRight: "8px" }}
            >
              Create Account
            </Button>
            <Button
              appearance="default"
              type="reset"
              onClick={() => {
                navigate("/");
              }}
            >
              Back To Login
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Register;
