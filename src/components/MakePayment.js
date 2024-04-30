import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  Container,
  Sidebar,
  Header,
  Content,
  Message,
  FlexboxGrid,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const MakePayment = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const url = queryParams.get("url");
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
            {" "}
            <TopBar />
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <div className="show-grid">
              <FlexboxGrid style={{ marginBottom: 10 }}>
                <FlexboxGrid.Item style={{ fontSize: "1.5rem" }} colspan={10}>
                  Please Select Your Preffered Mode of Payment
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <Message type="warning">
                <h6>
                  <strong>Warning!</strong> Please note that payments are made in Uganda Shillings only..
                </h6>
              </Message>
              <br />
              <iframe style={{border: 0}} src={url} width={"100%"} height={500}></iframe>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default MakePayment;
