import React from "react";
import { Container, Sidebar, Header } from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const ManageUsers = (props) => {
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
            <TopBar/>
          </Header>
        </Container>
      </Container>
    </div>
  );
};

export default ManageUsers;
