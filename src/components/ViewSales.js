import React, { useState } from "react";
import { Container, Content, FlexboxGrid, Header, Sidebar, Form, Placeholder, Table } from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const ViewSales = (props) => {
  const [data, setData] = useState([]);
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
            <TopBar />
            
          </Header>
          <Content style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}>
            <div className="show-grid">
              <FlexboxGrid style={{ marginBottom: 10 }}>
                <FlexboxGrid.Item style={{ fontSize: "1.5rem" }} colspan={6}>
                  Showing All Sales
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                  <Form>
                    <Form.Control
                      placeholder="Search..."
                      
                    />
                  </Form>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              
            </div>
            <div
              style={{ marginBottom: 10, display: "flex", gap: "5px" }}
            >
              {/* Position For Buttons to export PDF and Excel */}
            </div>
            <div>
              {data.length === 0 ? (
                <div>
                <Placeholder.Grid rows={10} columns={6} active />
              </div>
              ) : (
                <Table></Table>
              )}
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default ViewSales;
