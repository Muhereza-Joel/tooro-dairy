import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Header,
  Content,
  Footer,
  Sidebar,
  Grid,
  Row,
  Col,
  Calendar,
  Panel,
} from "rsuite";
import SideNav from "./SideNav";
import DashboardPanel from "./DashboardPanel";
import TopBar from "./TopBar";
import SalesGraph from "./SalesGraph";
import Cookies from "js-cookie";

const Dashboard = (props) => {
  const [role, setRole] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState(null);
  const [tatalBalances, setTotalBalances] = useState(null);
  const [revenueToday, setRevenueToday] = useState(null);
  const [revenueThisWeek, setRevenueThisWeek] = useState(null);
  const [revenueThisMonth, setRevenueThisMonth] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("tdmis");

    if (userCookie) {
      try {
        const userDataFromCookie = JSON.parse(userCookie);

        setRole(userDataFromCookie.role);

        if (typeof userDataFromCookie === "object") {
        } else {
          console.error("Invalid user data format in the cookie");
        }
      } catch (error) {
        console.error("Error parsing JSON from the cookie:", error);
      }
    }
  }, []);

  const isAdmin = role === "administrator";
  const isUser = role === "user";

  useEffect(() => {
    const fetchUsersCount = async (route) => {
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/metrics/${route}`
        );

        if (response.ok) {
          const data = await response.json();
          switch (route) {
            case "users-count":
              setUsersCount(data.count);
              break;
            case "active-subscriptions-count":
              setActiveSubscriptions(data.count);
              break;

            case "stock-balances":
              setTotalBalances(data.sumOfBalances);
              break;

            case "revenue-today":
              setRevenueToday(data.salesToday);
              break;

            case "revenue-this-week":
              setRevenueThisWeek(data.salesThisWeek);
              break;

            case "revenue-this-month":
              setRevenueThisMonth(data.salesThisMonth);
              break;

            default:
              break;
          }
        } else {
          toast.error("Failed to connect to the server...", {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
        }
      } catch (error) {
        toast.error("Failed to connect to the server, Please try again...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    };

    fetchUsersCount("users-count");
    fetchUsersCount("active-subscriptions-count");
    fetchUsersCount("stock-balances");
    fetchUsersCount("revenue-today");
    fetchUsersCount("revenue-this-week");
    fetchUsersCount("revenue-this-month");
  }, []);

  return (
    <div className="show-container">
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
          <Content>
            <Grid fluid>
              <Row className="show-grid" style={{ padding: "15px 8px" }}>
              {(isAdmin || isUser) && (
                <Col xs={18} sm={18} md={18}>
                  <Row className="show-grid">
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel title="All Users" data={usersCount} />
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel
                        title="Active Sale Subscriptions"
                        data={activeSubscriptions}
                      />
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel
                        title="Total Stock Balances Unpaid"
                        data={tatalBalances}
                      />
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel
                        title="Sales Today"
                        data={revenueToday}
                        currency="UGX"
                      />
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel
                        title="Sales This Week"
                        data={revenueThisWeek}
                        currency="UGX"
                      />
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ marginBottom: 15 }}>
                      <DashboardPanel
                        title="Sales This Month"
                        data={revenueThisMonth}
                        currency="UGX"
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} style={{ marginBottom: 0 }}>
                      <Panel shaded bordered header="Sales made this month">
                        <SalesGraph />
                      </Panel>
                    </Col>
                  </Row>
                </Col>

              )}
                <Col xs={6} sm={6} md={6} style={{ marginTop: 0 }}>
                  <Panel
                    shaded
                    bordered
                    style={{ height: "calc(100vh - 250px)" }}
                  >
                    <Calendar style={{ height: "100%" }} />
                  </Panel>
                </Col>
              </Row>
              <br />
            </Grid>
          </Content>
        </Container>
      </Container>
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
    </div>
  );
};

export default Dashboard;
