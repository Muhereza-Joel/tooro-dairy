import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Container,
  Sidebar,
  Content,
  Header,
  Placeholder,
  Footer,
  Form,
} from "rsuite";
import SideNav from "./SideNav";
import moment from "moment";

const { Column, HeaderCell, Cell } = Table;

const Users = (props) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);

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

  const handleSearch = (value) => {
    // Use originalData for searching
    const filteredData = originalData.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/auth/users"
        );
        const users = await response.json();
        setOriginalData(users); // Store original data
        setData(users); // Initialize displayed data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

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
            Header
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <div style={{ marginBottom: 10 }}>
              <Form>
                <Form.Control
                  placeholder="Search..."
                  onChange={(value) => handleSearch(value)}
                />
              </Form>
            </div>
            {data.length === 0 ? (
              <div>
                <Placeholder.Grid rows={10} columns={4} active />
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
                      {moment(data.created_at).format("MMMM D, YYYY")}
                    </Cell>
                  </Column>
                  <Column width={200} flexGrow={1}>
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Last Updated On
                    </HeaderCell>
                    <Cell style={{ fontSize: "1.0rem" }}>
                      {moment(data.updated_at).format("MMMM D, YYYY")}
                    </Cell>
                  </Column>
                </Table>
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

export default Users;
