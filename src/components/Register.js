import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (formValue) => {
    setFormData(formValue);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.username || !formData.email || !formData.password) {
        return;
      }

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (!data.user || !data.user.errors) {
          toast.success("Account created successfully...", {
            style: { backgroundColor: "#cce6e8", color: "#333" },
          });

          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          const errors = data.user.errors;

          // Iterate through the keys of errors object
          Object.keys(errors).forEach((errorType) => {
            const errorMessage = errors[errorType];

            // Display a toast for each error
            toast.error(`${errorMessage}`, {
              style: { backgroundColor: "#fcd0d0", color: "#333" },
            });
          });
        }
      } else {
        toast.error("Failed to create your account...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }

      console.log(formData);
      // navigate("/dashboard");
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <img src="http://localhost:3002/dist/images/logo.png" height="120" style={{ objectFit: "cover" }} />
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
                navigate("/auth/login");
              }}
            >
              Back To Login
            </Button>
          </div>
        </Form.Group>
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

export default Register;
