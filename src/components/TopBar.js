import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dropdown, FlexboxGrid } from "rsuite";
import Avator from "../assets/images/avator.jpg";
import Cookies from "js-cookie";

const TopBar = (props) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const userId = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).id
    : null;
  const username = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).username
    : null;

  const avatorStyle = {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    border: "2px solid #299ea6",
    marginTop: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
    borderRadius: "50%",
  };

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/auth/get-avator/${userId}`
        );

        if (response.ok) {
          const avatarData = await response.json();
          if (Array.isArray(avatarData) && avatarData.length > 0) {
            setAvatarUrl(avatarData[0].url);
          } else {
            console.error("Invalid avatar data structure");
          }
        } else {
          console.error("Failed to fetch avatarUrl");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchAvatarUrl();
  }, []);

  return (
    <div>
      <div className="show-grid">
        <FlexboxGrid style={{ margin: "10px 65px 10px 10px" }}>
          <FlexboxGrid.Item
            colspan={12}
            style={{ fontSize: "1.2rem" }}
          ></FlexboxGrid.Item>
          <FlexboxGrid.Item
            colspan={12}
            style={{ textAlign: "end", fontSize: "1.3rem" }}
          >
            <Dropdown title={`Hello ${username}`} size="md">
              <Dropdown.Item
                panel
                style={{ padding: 10, width: 220, textAlign: "center" }}
              >
                <img
                  src={avatarUrl || Avator}
                  style={avatorStyle}
                  alt="avatar"
                />
                <p>Signed in as</p>
                <strong>{username}</strong>
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item
                onClick={() => {
                  navigate("/dashboard/users/my-profile");
                }}
              >
                My profile
              </Dropdown.Item>

              <Dropdown.Separator />
              <Dropdown.Item>Help</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </div>
  );
};

export default TopBar;
