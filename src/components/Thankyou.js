import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { Container, Sidebar, Header, Message, Content } from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const Thankyou = (props) => {
  const userCookie = Cookies.get("tdmis-pesapal");
  const [data, setData] = useState([]);
  const userDataFromCookie = JSON.parse(userCookie);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const OrderTrackingId = queryParams.get("OrderTrackingId");
  const OrderMerchantReference = queryParams.get("OrderMerchantReference");

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await fetch(
            `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${userDataFromCookie.authToken}`,
                  },
            }
          );
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error("Error transaction status:", error);
        }
      };
  
      fetchData();
  }, [])

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
            <Message showIcon type="success" header="Transaction complete">
              <hr />
              <h5>
                Payment received successfully, thankyou for paying
                out your order.
              </h5>
              <p>We are processing your order to be ready for pickup</p>
            </Message>
            <br />

            <h3>Here are details of the transaction</h3>
            <br/>
            <h6>Method of Payment: <small> {data.payment_method}</small></h6>
            <br/>
            <h6>Amount Paid: <small> {data.amount}</small></h6>
            <br/>
            <h6>Transaction Status: <small> {data.payment_status_description}</small></h6>
            <br/>
            <h6>Confirmation Code: <small> {data.confirmation_code}</small></h6>
            <br/>
            <h6>Order Id: <small> {data.order_tracking_id}</small></h6>
            <br/>
            <h6>Order Reference: <small> {data.merchant_reference}</small></h6>
            <br/>
            <h6>Payment Account: <small> {data.payment_account}</small></h6>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Thankyou;
