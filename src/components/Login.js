import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Schema, Button } from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

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

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Save user data to cookie upon successful login
        Cookies.set(
          "tdmis",
          JSON.stringify({
            username: data.username,
            id: data.id,
            role: data.role,
            email: data.email,
            password: data.password,
          })
        );

        toast.success("Aunthentication Successfull...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });
        navigate("/dashboard");
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

  // useEffect(() => {
  //   const userCookie = Cookies.get("tdmis");

  //   if (userCookie) {
  //     try {
  //       const userDataFromCookie = JSON.parse(userCookie);
  //       setFormData(prevState => ({
  //         ...prevState,
  //         email: userDataFromCookie.email,
  //         password: userDataFromCookie.password,
  //       }));
  //       // Check if the parsed data is an object
  //       if (typeof userDataFromCookie === "object") {

  //       } else {

  //         console.error("Invalid user data format in the cookie");
  //       }
  //     } catch (error) {

  //       console.error("Error parsing JSON from the cookie:", error);
  //     }
  //   }
  // }, [])

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
