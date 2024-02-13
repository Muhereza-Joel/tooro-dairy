import React from "react";
import { useNavigate } from "react-router";
import { Dropdown, FlexboxGrid } from "rsuite";

const TopBar = (props) => {
  const navigate = useNavigate();
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
            <Dropdown title="Hello Miria" size="md">
              <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
                <p>Signed in as</p>
                <strong>foobar</strong>
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item>Your profile</Dropdown.Item>
              
              <Dropdown.Separator />
              <Dropdown.Item>Help</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item onClick={() => {navigate('/auth/login')}}>Sign out</Dropdown.Item>
            </Dropdown>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </div>
  );
};

export default TopBar;
