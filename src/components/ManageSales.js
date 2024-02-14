import React from "react";
import { Container, Content, Header, Sidebar } from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const ManageSales = (props) => {
  return (
    <div>
      <Container>
        <Sidebar
          style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}
        >
          <SideNav theme={props.theme} onChangeTheme={props.onChangeTheme} />
        </Sidebar>
        <Container>
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
          <Content style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}></Content>
        </Container>
      </Container>
    </div>
  );
};

export default ManageSales;
