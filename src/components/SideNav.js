import { Sidenav, Nav, IconButton } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const SideNav = (props) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

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
  const isCustomer = role === "customer";
  const isSupplier = role === "supplier";

  return (
    <div style={{ width: 240 }}>
      <Sidenav defaultOpenKeys={["3", "4", "8"]}>
        <Sidenav.Body
          style={{ height: "100vh", position: "sticky", top: 0, left: 0 }}
        >
          <Nav activeKey="1">
            <Nav.Item
              eventKey="1"
              icon={<DashboardIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Nav.Item>

            {(isAdmin || isUser) && (
              <Nav.Menu
                eventKey="2"
                title="User Management"
                icon={<GroupIcon />}
              >
                <Nav.Item
                  eventKey="2-1"
                  onClick={() => {
                    navigate("/dashboard/users");
                  }}
                >
                  All Users
                </Nav.Item>

                {isAdmin && (
                  <Nav.Item
                    eventKey="2-2"
                    onClick={() => {
                      navigate("/dashboard/users/manage");
                    }}
                  >
                    Manage Users
                  </Nav.Item>
                )}
              </Nav.Menu>
            )}

            {(isAdmin || isUser) && (
              <Nav.Menu
                eventKey="3"
                title="Stock Management"
                icon={<MagicIcon />}
              >
                <Nav.Item
                  eventKey="3-1"
                  onClick={() => {
                    navigate("/dashboard/stock/add");
                  }}
                >
                  Record Collections
                </Nav.Item>
                <Nav.Item
                  eventKey="3-2"
                  onClick={() => {
                    navigate("/dashboard/stock");
                  }}
                >
                  View Collections
                </Nav.Item>

                {isAdmin && (
                  <Nav.Item
                    eventKey="3-3"
                    onClick={() => {
                      navigate("/dashboard/stock/manage");
                    }}
                  >
                    Manage Stock
                  </Nav.Item>

                )}
              </Nav.Menu>
            )}

            {(isAdmin || isUser) && (
            <Nav.Menu
              eventKey="4"
              title="Sales Management"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="4-1"
                onClick={() => {
                  navigate("/dashboard/sales/add");
                }}
              >
                Record Sales
              </Nav.Item>
              <Nav.Item
                eventKey="4-2"
                onClick={() => {
                  navigate("/dashboard/sales");
                }}
              >
                View Sales
              </Nav.Item>
              <Nav.Item
                eventKey="4-3"
                onClick={() => {
                  navigate("/dashboard/sales/subscriptions/add/");
                }}
              >
                Manage Subscriptions
              </Nav.Item>

              {isAdmin && (
              <Nav.Item
                eventKey="4-3"
                onClick={() => {
                  navigate("/dashboard/sales/manage");
                }}
              >
                Manage Sales
              </Nav.Item>

              )}

            </Nav.Menu>

            )}

            {(isAdmin || isUser) && (
              <Nav.Menu
              eventKey="5"
              title="Report Management"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="5-1"
                onClick={() => {
                  navigate("/dashboard/sales/reports");
                }}
              >
                Sales Reports
              </Nav.Item>
              {/* <Nav.Item
                eventKey="5-2"
                onClick={() => {
                  navigate("/dashboard/stock/reports");
                }}
              >
                Stock Reports
              </Nav.Item> */}

              

            </Nav.Menu>

            )}

            {(isCustomer) && (
              <Nav.Menu
              eventKey="6"
              title="My Subscriptions"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="6-1"
                onClick={() => {
                  navigate("/dashboard/sales/my-subscriptions/");
                }}
              >
                My Plan
              </Nav.Item>
              {/* <Nav.Item
                eventKey="5-2"
                onClick={() => {
                  navigate("/dashboard/stock/reports");
                }}
              >
                Stock Reports
              </Nav.Item> */}

              

            </Nav.Menu>

            )}

            {(isAdmin || isUser) && (
              <Nav.Menu
              eventKey="7"
              title="Orders"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="7-1"
                onClick={() => {
                  navigate("/dashboard/orders/all/");
                }}
              >
                View Current Orders
              </Nav.Item>
              {/* <Nav.Item
                eventKey="5-2"
                onClick={() => {
                  navigate("/dashboard/stock/reports");
                }}
              >
                Stock Reports
              </Nav.Item> */}

              

            </Nav.Menu>

            )}

            {(isCustomer) && (
              <Nav.Menu
              eventKey="7"
              title="My Orders"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="7-1"
                onClick={() => {
                  navigate("/dashboard/orders/my-orders/");
                }}
              >
                View Current Orders
              </Nav.Item>
              {/* <Nav.Item
                eventKey="5-2"
                onClick={() => {
                  navigate("/dashboard/stock/reports");
                }}
              >
                Stock Reports
              </Nav.Item> */}

              

            </Nav.Menu>

            )}
            
            {(isSupplier) && (
              <Nav.Menu
              eventKey="8"
              title="My Supplies"
              icon={<MagicIcon />}
            >
              <Nav.Item
                eventKey="7-1"
                onClick={() => {
                  navigate("/dashboard/orders/my-supplies/");
                }}
              >
                My Supplies
              </Nav.Item>
              {/* <Nav.Item
                eventKey="5-2"
                onClick={() => {
                  navigate("/dashboard/stock/reports");
                }}
              >
                Stock Reports
              </Nav.Item> */}

              

            </Nav.Menu>

            )}

           
          </Nav>
          <IconButton
            icon={props.theme === "light" ? "Switch To Dark Mode" : "Switch To Light Mode"}
            appearance={props.theme === "light" ? "primary" : "ghost"}
            style={{ position: "fixed", bottom: 30, left: 50 }} 
            onClick={props.onChangeTheme}
          />
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default SideNav;
