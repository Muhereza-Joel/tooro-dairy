import React, { useState, useEffect } from "react";
import Avator from "../assets/images/avator.jpg";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "rsuite";
import "react-toastify/dist/ReactToastify.css";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import Cookies from "js-cookie";

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

const AvatorUploader = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const userId = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).id
    : null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setDisplayedImage(e.target.result);
      };

      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
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

  const handleAvatarChange = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("userId", userId);

      // Make a fetch request to your backend to save the photo
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/auth/change-avator`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const newAvatarUrl = await response.json();

          toast.success("Prifile picture changed, successfully", {
            style: { backgroundColor: "#cce6e8", color: "#333" },
          });
        } else {
          toast.error("Failed to change profile picture", {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <img
          src={displayedImage || avatarUrl || Avator}
          style={avatorStyle}
          className="rounded-circle"
          alt="avatar"
        />

        <div>
          {/* Button for changing avatar */}
          <div style={{ position: "absolute", top: 200, right: 20 }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <Button
                appearance="primary"
                title="Upload Image"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                <FileUploadIcon />
              </Button>
              <Button
                appearance="default"
                title="Save Image"
                onClick={handleAvatarChange}
              >
                <CheckOutlineIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatorUploader;
