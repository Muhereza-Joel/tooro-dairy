import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Schema, Button } from "rsuite";

const emailRule = Schema.Types.StringType()
  .isEmail("Please enter a valid email address.")
  .isRequired("Email or Username is required");
const passwordRule = Schema.Types.StringType().isRequired(
  "Password is required"
);

const Login = () => {
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (formValue) => {
    setFormData(formValue);
  }

  const handleSubmit = async () => {
    if(!formData.email || !formData.password){
      return
    }
    console.log(formData);
    navigate("/dashboard");
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <h4 style={{ textAlign: "center" }}>Login To Your Account</h4>
        <br />

        <Form.Group controlId="email-6">
          <Form.ControlLabel style={{ textAlign: "start" }}>
            Email or Username
          </Form.ControlLabel>
          <Form.Control
            value={formData.email}
            name="email"
            type="email"
            placeholder="Enter your email here"
            rule={emailRule}
          />
        </Form.Group>
        <Form.Group controlId="password-6">
          <Form.ControlLabel style={{ textAlign: "start" }}>
            Password
          </Form.ControlLabel>
          <Form.Control
            value={formData.password}
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
              marginTop: "4px",
            }}
          >
            <Button
              appearance="primary"
              type="submit"
              style={{ marginRight: "8px" }}
            >
              Sign in
            </Button>
          </div>
        </Form.Group>
        <h6>
          Not Yet registered?{" "}
          <a onClick={() =>{navigate("/auth/register")}}>Click here to register</a>
        </h6>
      </Form>
    </div>
  );
};

export default Login;
