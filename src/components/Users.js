import React from "react";
import {
  Table,
  Pagination,
  Container,
  Sidebar,
  Content,
  Header,
  Placeholder,
} from "rsuite";
import SideNav from "./SideNav";

const { Column, HeaderCell, Cell } = Table;
const defaultData = [];

const Users = (props) => {
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = [];

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
          <Content style={{ padding: "0px 20px" }}>
            {data.length === 0 ? (
              <div>
                <Placeholder.Grid rows={10} columns={4} active />
                
              </div>
            ) : (
              <div>
                <Table height="80vh" data={data} bordered cellBordered>
                  <Column width={50} align="center" fixed>
                    <HeaderCell style={{ fontSize: "1rem" }}>Id</HeaderCell>
                    <Cell dataKey="id" />
                  </Column>

                  <Column width={200} fixed>
                    <HeaderCell style={{ fontSize: "1rem" }}>
                      First Name
                    </HeaderCell>
                    <Cell dataKey="firstName" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell style={{ fontSize: "1rem" }}>
                      Last Name
                    </HeaderCell>
                    <Cell dataKey="lastName" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell style={{ fontSize: "1rem" }}>City</HeaderCell>
                    <Cell dataKey="city" />
                  </Column>
                  <Column width={200} flexGrow={1}>
                    <HeaderCell style={{ fontSize: "1rem" }}>Email</HeaderCell>
                    <Cell dataKey="email" />
                  </Column>
                </Table>

                <div style={{ padding: 20 }}>
                  <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={["total", "-", "limit", "|", "pager", "skip"]}
                    total={defaultData.length}
                    limitOptions={[10, 30, 50]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                    style={{ fontSize: "1.2rem" }}
                  />
                </div>
              </div>
            )}
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Users;
