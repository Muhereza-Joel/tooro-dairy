import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Schema, Button, Carousel, FlexboxGrid } from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated, login } from "../auth";

import cow from "../assets/images/cow.jpg";
import yourghut from "../assets/images/yorghut.jpg";
import milke from "../assets/images/milke.jpg";
import yourghut1 from "../assets/images/yourghut.jpg";
import logo from "../assets/images/logo.png";

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
    password: "",
  });

  const handleChange = (formValue) => {
    setFormData(formValue);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.password) {
        return;
      }

      const authenticationResult = await login(
        formData.email,
        formData.password
      );

      if (authenticationResult.success) {
        toast.success("Aunthentication Successfull...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });

        if (authenticationResult.profileCreated) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/users/create-profile");
        }
      } else {
        toast.error("Aunthentication failed, Please try again...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };

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
      <img src={logo} height="120" style={{ objectFit: "cover" }} />
      <h3>Tooro Dairy Mangement System</h3>
      <br />
      <br />
      <div className="show-grid">
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={6}>
            <Carousel autoplay className="custom-slider">
              <img src={cow} height="250" style={{ objectFit: "cover" }} />
              <img src={yourghut} height="250" />
              <img src={milke} height="250" />
              <img src={yourghut1} height="250" />
            </Carousel>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
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
                  Email Adress
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
                <a
                  onClick={() => {
                    navigate("/auth/register");
                  }}
                >
                  Click here to register
                </a>
              </h6>
            </Form>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
