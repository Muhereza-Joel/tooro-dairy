import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import {
  Container,
  Sidebar,
  Header,
  Table,
  Content,
  Placeholder,
  FlexboxGrid,
  Message,
  Footer,
  Pagination,
  Button,
  Modal,
  Loader,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import moment from "moment";
const { Column, HeaderCell, Cell } = Table;

const AllOrders = (props) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userId, setUserId] = useState(null);
  const userCookie = Cookies.get("tdmis");
  const userDataFromCookie = JSON.parse(userCookie);

  useEffect(() => {
    if (userCookie) {
      try {
        const userDataFromCookie = JSON.parse(userCookie);

        setRole(userDataFromCookie.role);
        setUserId(userDataFromCookie.id);
        setUsername(userDataFromCookie.username);
        setEmail(userDataFromCookie.email)

        if (typeof userDataFromCookie === "object") {
        } else {
          console.error("Invalid user data format in the cookie");
        }
      } catch (error) {
        console.error("Error parsing JSON from the cookie:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/tdmis/api/v1/orders/all`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const getData = () => {
    if (sortColumn && sortType) {
      return [...data].sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (typeof x === "string") {
          x = x.toLowerCase();
        }
        if (typeof y === "string") {
          y = y.toLowerCase();
        }

        if (sortType === "asc") {
          return x > y ? 1 : -1;
        } else {
          return x < y ? 1 : -1;
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

 

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
                  Showing Orders You Placed.
                </FlexboxGrid.Item>
              </FlexboxGrid>
              
              <br />
            </div>
            {data.length === 0 ? (
              <div>
                <Placeholder.Grid rows={10} columns={6} active />
              </div>
            ) : (
              <div>
                <Table
                  autoHeight
                  data={getData().slice((page - 1) * limit, page * limit)}
                  bordered
                  cellBordered
                  sortColumn={sortColumn}
                  sortType={sortType}
                  onSortColumn={handleSortColumn}
                  loading={loading}
                >
                  <Column width={50} align="center">
                    <HeaderCell style={{ fontSize: "1rem" }}>SNo.</HeaderCell>
                    <Cell style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                      {(rowData, rowIndex) => {
                        const sno = (page - 1) * limit + rowIndex + 1;
                        return <span>{sno}</span>;
                      }}
                    </Cell>
                  </Column>

                  <Column width={200} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Product
                    </HeaderCell>
                    <Cell
                      dataKey="product_name"
                      style={{ fontSize: "1.0rem" }}
                    />
                  </Column>

                  <Column width={200} resizable sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Quantity (litres or kgs)
                    </HeaderCell>
                    <Cell dataKey="quantity" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={120} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Unit Price
                    </HeaderCell>
                    <Cell dataKey="unit_price" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={120} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Total
                    </HeaderCell>
                    <Cell dataKey="total" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={120} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Status
                    </HeaderCell>
                    <Cell dataKey="status" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={150} flexGrow={1}>
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Added On
                    </HeaderCell>
                    <Cell style={{ fontSize: "1.0rem" }}>
                      {(rowData) =>
                        moment(rowData.created_at).format("MMMM D, YYYY")
                      }
                    </Cell>
                  </Column>
                  
                </Table>
                <Modal open={showModal}>
                  <Modal.Body><Loader size="sm"/> Initializing please wait...</Modal.Body>
                </Modal>
              </div>
            )}
          </Content>
          <Footer
            style={{
              height: "10vh",
              position: "sticky",
              bottom: 20,
              zIndex: 1000,
            }}
          >
            <div style={{ padding: 20 }}>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="md"
                layout={["total", "-", "limit", "|", "pager", "skip"]}
                total={Math.ceil(data.length)} // Adjust total for pages
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </Footer>
        </Container>
      </Container>
    </div>
  );
};

export default AllOrders;
