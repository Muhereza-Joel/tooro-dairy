import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  Container,
  Sidebar,
  Header,
  Table,
  Content,
  Placeholder,
  FlexboxGrid,
  Message
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import moment from "moment";
const { Column, HeaderCell, Cell } = Table;

const Orders = (props) => {
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
                  Showing Orders You Placed Recently
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <Message type="warning">
                <h6><strong>Warning!</strong> Please Note that only (40) recent orders your recently placed are shown here.</h6>
              </Message>
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
                      Username
                    </HeaderCell>
                    <Cell dataKey="username" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={200} resizable sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Email
                    </HeaderCell>
                    <Cell dataKey="email" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={200} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Role
                    </HeaderCell>
                    <Cell dataKey="role" style={{ fontSize: "1.0rem" }} />
                  </Column>
                  <Column width={200} flexGrow={1}>
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
                  <Column width={200} flexGrow={1}>
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Last Updated
                    </HeaderCell>
                    <Cell style={{ fontSize: "1.0rem" }} dataKey="updated_at">
                      {(rowData) => moment(rowData.updated_at).fromNow()}
                    </Cell>
                  </Column>
                </Table>
              </div>
            )}
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Orders;
