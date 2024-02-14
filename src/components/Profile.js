import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  Col,
  Container,
  Content,
  Grid,
  Header,
  Panel,
  Sidebar,
  Form,
  Row,
  FlexboxGrid,
  InputPicker,
  Button,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import AvatorUploader from "./AvatorUploader";

const selectData = ["Male", "Female"].map((item) => ({
  label: item,
  value: item,
}));

const Profile = (props) => {
  const [isEditing, setIsEditing] = useState();
  const [isEditPassword, setIsEditingPassword] = useState();
  const [avatarUrl, setAvatarUrl] = useState("");
  const userId = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).id
    : null;
  const username = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).username
    : null;
  const email = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).email
    : null;

  const [formData, setFormData] = useState({
    username: username,
    fullname: "",
    email: email,
    gender: "",
    dateOfBirth: "",
    homeCountry: "",
    city: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/auth/profile/${userId}`
        );

        if (response.ok) {
          const profileDataArray = await response.json();
          if (Array.isArray(profileDataArray) && profileDataArray.length > 0) {
            const profileData = profileDataArray[0];

            // Extract only the date part from the dob property
            const dateOnly = profileData.dob
              ? profileData.dob.substring(0, 10)
              : null;

            setFormData({
              username: profileData.username,
              fullname: profileData.fullname,
              email: profileData.email,
              gender: profileData.gender,
              dateOfBirth: dateOnly,
              homeCountry: profileData.country,
              city: profileData.city,
              phoneNumber: profileData.phone_number,
              password: profileData.password,
            });
          }
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (formValue) => {
    setFormData(formValue);
  };

  const handleEditClick = async () => {
    const isEmptyField = Object.values(formData).some((value) => value === "");

    if (isEmptyField) {
      toast.error("Please fill in all fields", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
      setIsEditing(!isEditing);
      return;
    }


    if (isEditing) {
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/auth/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Add any other headers needed for authentication
            },
            body: JSON.stringify({
              username: formData.username,
              fullname: formData.fullname,
              email: formData.email,
              gender: formData.gender,
              dateOfBirth: formData.dateOfBirth,
              homeCountry: formData.homeCountry,
              city: formData.city,
              phoneNumber: formData.phoneNumber,
              userId: userId,
            }),
          }
        );

        if (response.ok) {
          const { message } = response;
          toast.success(`Profile updated successfully`, {
            style: { backgroundColor: "#cce6e8", color: "#333" },
          });
          setIsEditing(false);
        } else {
          const { message } = response;
          toast.error(`Failed to update profile`, {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
        }
      } catch (error) {
        console.error("Error during profile update:", error);
      }
    }
  };

  const avatorStyle = {
    width: "350px",
    height: "350px",
    objectFit: "cover",
    border: "2px solid #299ea6",
    marginTop: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
    borderRadius: "50%",
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
                <Col xs={10}>
                  <Panel bordered style={{ padding: "10px" }}>
                    <AvatorUploader/>
                    <FlexboxGrid justify="center">
                      <FlexboxGrid.Item colspan={6}>
                        <Button onClick={handleEditClick}>
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={6}>
                        <Button>
                          {isEditPassword ? "Save Changes" : "Change Password"}
                        </Button>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </Panel>
                </Col>

                <Col xs={12} lg={12} xl={12} xxl={12}>
                  <Panel bordered>
                    <Form
                      fluid
                      onChange={handleInputChange}
                      formValue={formData}
                    >
                      <Form.Group>
                        <Form.ControlLabel>Username</Form.ControlLabel>
                        <Form.Control
                          type="text"
                          name="username"
                          value={username}
                          readOnly={!isEditing}
                          placeholder="Enter your username..."
                        />
                        <Form.HelpText>
                          This is your public username
                        </Form.HelpText>
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel>Full Name</Form.ControlLabel>
                        <Form.Control
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          readOnly={!isEditing}
                          placeholder="Enter your full name here..."
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel>Email</Form.ControlLabel>
                        <Form.Control
                          type="email"
                          name="email"
                          value={email}
                          readOnly={!isEditing}
                          placeholder="Enter your email here..."
                        />
                        <Form.HelpText>
                          This is your public email address
                        </Form.HelpText>
                      </Form.Group>
                      <Form.Group>
                        <FlexboxGrid justify="space-between">
                          <FlexboxGrid.Item colspan={12}>
                            <Form.ControlLabel>Phone Number</Form.ControlLabel>
                            <Form.Control
                              type="number"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              readOnly={!isEditing}
                              placeholder="Enter your phone number here..."
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={10}>
                            <Form.ControlLabel>Gender</Form.ControlLabel>
                            <InputPicker
                              type="text"
                              value={formData.gender}
                              name="gender"
                              readOnly={!isEditing}
                              data={selectData}
                              onChange={(value) =>
                                setFormData({ ...formData, gender: value })
                              }
                            />
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </Form.Group>

                      <Form.Group>
                        <FlexboxGrid justify="space-between">
                          <FlexboxGrid.Item colspan={8}>
                            <Form.ControlLabel>Date of Birth</Form.ControlLabel>
                            <Form.Control
                              type={!isEditing ? "text" : "date"}
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              readOnly={!isEditing}
                              onChange={(value) =>
                                setFormData({ ...formData, dateOfBirth: value })
                              }
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={8}>
                            <Form.ControlLabel>Country</Form.ControlLabel>
                            <Form.Control
                              type="text"
                              name="homeCountry"
                              value={formData.homeCountry}
                              readOnly={!isEditing}
                              placeholder="Home county"
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={7}>
                            <Form.ControlLabel>City</Form.ControlLabel>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              readOnly={!isEditing}
                              placeholder="Home City"
                            />
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </Form.Group>
                    </Form>
                  </Panel>
                </Col>
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

export default Profile;
