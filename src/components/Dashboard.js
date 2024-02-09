import React from "react";
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

const Dashboard = (props) => (
  <div className="show-container">
    <Container>
      <Sidebar style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <SideNav theme={props.theme} onChangeTheme={props.onChangeTheme}/>
      </Sidebar>
      <Container style={{ marginLeft: 240, padding: "0 10 10 10" }}>
        <Header
          style={{
            height: "10vh",
            position: "sticky",
            top: 0,
            zIndex: 1000
          }}
        >
          Header
        </Header>
        <Content>
          <Grid fluid>
            <Row className="show-grid" style={{padding:"3px 8px"}}>
              <Col xs={24} sm={24} md={8}>
                <DashboardPanel />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <DashboardPanel />
              </Col>
              <Col xs={24} sm={24} md={8}>
              <Panel shaded>
                  <Calendar />
                </Panel>
              </Col>
            </Row>
            <br/>
            
          </Grid>
        </Content>
        
      </Container>
    </Container>
  </div>
);

export default Dashboard;
