import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Sidebar,
  Header,
  Content,
  Form,
  Grid,
  Row,
  Col,
  InputPicker,
  Button,
  Panel,
  Message,
  Schema,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const nameRule = Schema.Types.StringType().isRequired(
  "The username is required."
);
const emailRule = Schema.Types.StringType()
  .isEmail("Please enter a valid email address.")
  .isRequired("Email is required");

const roleRule = Schema.Types.StringType().isRequired("Role is required");

const ManageUsers = (props) => {
  const selectData = ["administrator", "customer","supplier", "user"].map((item) => ({
    label: item,
    value: item,
  }));

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const handleChange = (formValue) => {
    setFormData(formValue);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.username || formData.username.trim() === "") {
        return;
      }

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/auth/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            role: formData.role || "customer",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (!data || !data.errors) {
          toast.success("Account created successfully...", {
            style: { backgroundColor: "#cce6e8", color: "#333" },
          });

          setFormData({
            username: "",
            email: "",
            role: "",
          });

        } else {
          const errors = data.errors;

          // Iterate through the keys of errors object
          Object.keys(errors).forEach((errorType) => {
            const errorMessage = errors[errorType];

            // Display a toast for each error
            toast.error(`${errorMessage}`, {
              style: { backgroundColor: "#fcd0d0", color: "#333" },
            });
          });
        }
        
        
      }

    } catch (error) {
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };

  return (
    <div>
      <Container>
        <Sidebar
          style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}
        >
          <SideNav theme={props.theme} onChangeTheme={props.onChangeTheme} />
        </Sidebar>
        <Container style={{ marginLeft: 240, padding: "0 10 10 10" }}>
          <Header
            style={{
              height: "10vh",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <TopBar />
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <Grid fluid>
              <Row className="show-grid">
                <Col lg={10} xl={10} xxl={10}>
                  <Message
                    showIcon
                    type="warning"
                    style={{ marginBottom: "15px" }}
                  >
                    <strong>Note: </strong>A default password will be assigned
                    to the user automatically, this will require the user to
                    change his password on the next login.
                    <strong>
                      {" "}
                      The user will take a default role of customer if no role
                      is assigned...
                    </strong>
                  </Message>
                  <Panel bordered>
                    <Form
                      fluid
                      formValue={formData}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                    >
                      <h5 style={{ textAlign: "start" }}>Create New User</h5>
                      <br />
                      <Form.Group>
                        <Form.ControlLabel>Enter Username</Form.ControlLabel>
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="Enter username here..."
                          rule={nameRule}
                        />
                        <Form.HelpText>Username is required</Form.HelpText>
                      </Form.Group>

                      <Form.Group>
                        <Form.ControlLabel>Enter Email</Form.ControlLabel>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter email here..."
                          rule={emailRule}
                        />
                        <Form.HelpText>Email is required</Form.HelpText>
                      </Form.Group>

                      <Form.Group>
                        <div>
                          <InputPicker
                            type="text"
                            name="role"
                            data={selectData}
                            rule={roleRule}
                            onChange={(value) =>
                              setFormData({ ...formData, role: value })
                            }
                          />
                        </div>
                      </Form.Group>

                      <div>
                        <Button type="submit" appearance="primary">
                          Add User
                        </Button>
                        <Button
                          type="submit"
                          appearance="primary"
                          color="red"
                          style={{ margin: "0px 10px" }}
                          onClick={() => {
                            setFormData({
                              username: "",
                              email: "",
                              role: ""
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </Panel>
                </Col>
                <Col lg={12} xl={8} xxl={12}></Col>
              </Row>
            </Grid>
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
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default ManageUsers;
