import React from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avator from "../assets/images/avator.jpg";
import Cookies from "js-cookie";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import { Container, Content, Header, Sidebar, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const StockReports = (props) => {
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
          <Content style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}>

          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default StockReports;
