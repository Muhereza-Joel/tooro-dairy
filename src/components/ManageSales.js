import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Content,
  Header,
  Sidebar,
  Row,
  Col,
  Message,
  Panel,
  RadioTileGroup,
  RadioTile,
  Divider,
  Tabs,
  Placeholder,
  Form,
  Input,
  ButtonGroup,
  Button,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const ManageSales = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedSalesPlan, setSelectedSalesPlan] = useState("daily");
  const [defaultDiscount, setDefaultDiscount] = useState("");
  const [defaultTaxRate, setDefaultTaxRate] = useState("");
  

  const [dailyPlanFormData, setDailyPlanFormData] = useState({
    id: "",
    description: "",
    discount: "",
    taxRate: "",
  });
  const [weeklyPlanFormData, setWeeklyPlanFormData] = useState({
    id: "",
    description: "",
    discount: "",
    taxRate: "",
  });
  const [monthlyPlanFormData, setMonthlyPlanFormData] = useState({
    id: "",
    description: "",
    discount: "",
    taxRate: "",
  });

  const [salesPlans, setSalesPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/sales/sales-settings",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setSalesPlans(data);
  
        // Fetch and set default values for discount and taxRate based on the selected plan
        const selectedPlanData = data.find((plan) => plan.name === selectedSalesPlan);
        if (selectedPlanData) {
          setDefaultDiscount(selectedPlanData.discount || "");
          setDefaultTaxRate(selectedPlanData.tax_rate || "");
        }
      } catch (error) {
        console.error("Failed to connect to the server:", error);
        toast.error("Failed to connect to the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    };
  
    fetchData();
  }, [selectedSalesPlan]);
  

  useEffect(() => {
    const selectedPlanData = salesPlans.find(
      (plan) => plan.name === selectedSalesPlan
    );
    if (selectedPlanData) {
      switch (selectedSalesPlan) {
        case "daily":
          setDailyPlanFormData({
            id: selectedPlanData.id || "",
            description: selectedPlanData.description || "",
            discount: selectedPlanData.discount || "",
            taxRate: selectedPlanData.tax_rate || "",
          });
          break;
        case "weekly":
          setWeeklyPlanFormData({
            id: selectedPlanData.id || "",
            description: selectedPlanData.description || "",
            discount: selectedPlanData.discount || "",
            taxRate: selectedPlanData.tax_rate || "",
          });
          break;
        case "monthly":
          setMonthlyPlanFormData({
            id: selectedPlanData.id || "",
            description: selectedPlanData.description || "",
            discount: selectedPlanData.discount || "",
            taxRate: selectedPlanData.tax_rate || "",
          });
          break;
        default:
          break;
      }
    }
  }, [selectedSalesPlan, salesPlans]);

  const handleSalesPlanChange = (value) => {
    const tabKeyMap = {
      daily: "1",
      weekly: "2",
      monthly: "3",
    };
    setActiveTab(tabKeyMap[value]);
    setSelectedSalesPlan(value);
  };

  const handleDailyPlanFormChange = (formValue) => {
    setDailyPlanFormData(formValue);
  };

  const handleWeeklyPlanFormChange = (formValue) => {
    setWeeklyPlanFormData(formValue);
  };

  const handleMonthlyPlanFormChange = (formValue) => {
    setMonthlyPlanFormData(formValue);
  };

  const handleSubmitDailyPlan = async () => {
    try {
      const apiUrl = `http://localhost:3002/tdmis/api/v1/sales/sales-settings/${dailyPlanFormData.id}`;
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: dailyPlanFormData.description,
          discount: dailyPlanFormData.discount,
          taxRate: dailyPlanFormData.taxRate,
        }),
      });
  
      if (response.ok) {
        const updatedDailyPlan = await response.json();
  
        // Update default values and form data with the updated monthly plan
        setDefaultDiscount(updatedDailyPlan.discount || "");
        setDefaultTaxRate(updatedDailyPlan.tax_rate || "");
  
        setMonthlyPlanFormData({
          ...dailyPlanFormData,
          description: updatedDailyPlan.description || "",
          discount: updatedDailyPlan.discount || "",
          taxRate: updatedDailyPlan.tax_rate || "",
        });
  
        toast.success("Successfully updated daily plan settings");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update daily plan settings: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to connect to the server:", error);
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };


  const handleSubmitWeeklyPlan = async () => {
    try {
      const apiUrl = `http://localhost:3002/tdmis/api/v1/sales/sales-settings/${weeklyPlanFormData.id}`;
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: weeklyPlanFormData.description,
          discount: weeklyPlanFormData.discount,
          taxRate: weeklyPlanFormData.taxRate,
        }),
      });
  
      if (response.ok) {
        const updatedWeeklyPlan = await response.json();
  
        // Update default values and form data with the updated monthly plan
        setDefaultDiscount(updatedWeeklyPlan.discount || "");
        setDefaultTaxRate(updatedWeeklyPlan.tax_rate || "");
  
        setMonthlyPlanFormData({
          ...monthlyPlanFormData,
          description: updatedWeeklyPlan.description || "",
          discount: updatedWeeklyPlan.discount || "",
          taxRate: updatedWeeklyPlan.tax_rate || "",
        });
  
        toast.success("Successfully updated weekly plan settings");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update weekly plan settings: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to connect to the server:", error);
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };


  const handleSubmitMonthlyPlan = async () => {
    try {
      const apiUrl = `http://localhost:3002/tdmis/api/v1/sales/sales-settings/${monthlyPlanFormData.id}`;
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: monthlyPlanFormData.description,
          discount: monthlyPlanFormData.discount,
          taxRate: monthlyPlanFormData.taxRate,
        }),
      });
  
      if (response.ok) {
        const updatedMonthlyPlan = await response.json();
  
        // Update default values and form data with the updated monthly plan
        setDefaultDiscount(updatedMonthlyPlan.discount || "");
        setDefaultTaxRate(updatedMonthlyPlan.tax_rate || "");
  
        setMonthlyPlanFormData({
          ...monthlyPlanFormData,
          description: updatedMonthlyPlan.description || "",
          discount: updatedMonthlyPlan.discount || "",
          taxRate: updatedMonthlyPlan.tax_rate || "",
        });
  
        toast.success("Successfully updated monthly plan settings");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update monthly plan settings: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to connect to the server:", error);
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
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
            <TopBar />
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <Row className="show-grid">
              <Col xs={10}>
                <Message showIcon type="info" style={{ marginBottom: "15px" }}>
                  Set up sales plans for your store, customers will subscribe to
                  a specific plan when placing orders.
                  <br />
                  <strong>Entering new values updates the existing rows</strong>
                </Message>

                <Panel bordered>
                  <RadioTileGroup
                    name="salesPlan"
                    aria-label="Stock Plans"
                    value={selectedSalesPlan}
                    onChange={handleSalesPlanChange}
                  >
                    <RadioTile label="Daily Sales Plan" value="daily">
                      <Divider />
                      This plan applies to sales paid on a daily basis. A
                      customer who subscribes for this plan, pays instantly
                      after placing an order.
                    </RadioTile>

                    <RadioTile label="Weekly Sales Plan" value="weekly">
                      <Divider />
                      This plan applies to sales paid on a weekly basis. A
                      customer who subscribes for this plan, pays a weekly bill
                      before placing an order.
                    </RadioTile>

                    <RadioTile label="Monthly Sales Plan" value="monthly">
                      <Divider />
                      This plan applies to sales paid on a monthly basis. A
                      customer who subscribes for this plan, pays a monthly bill
                      before placing an order.
                    </RadioTile>
                  </RadioTileGroup>
                </Panel>
              </Col>
              <Col xs={14}>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(activeKey) => setActiveTab(activeKey)}
                  defaultActiveKey="1"
                  vertical
                  appearance="subtle"
                >
                  <Tabs.Tab eventKey="1">
                    <Panel bordered>
                      <Form
                        fluid
                        onSubmit={handleSubmitDailyPlan}
                        formValue={dailyPlanFormData}
                        onChange={handleDailyPlanFormChange}
                      >
                        <Form.Group>
                          <Form.ControlLabel>
                            Daily Plan Description
                          </Form.ControlLabel>
                          <Form.Control
                            rows={5}
                            name="description"
                            accepter={Textarea}
                            Placeholder="Enter daily plan description here..."
                            value={dailyPlanFormData.description}
                          />
                          <Form.HelpText>
                            Add a detailed description of the plan, it will
                            visible to customers subscribing and recording
                            sales.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Discount (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" step="0.01" value={defaultDiscount}/>
                          <Form.ControlLabel>
                            Set discount (%)
                          </Form.ControlLabel>
                          <Form.Control
                            type="number"
                            step="0.01"
                            name="discount"
                            placeholder="Enter daily discount here"
                            value={dailyPlanFormData.discount}
                          />
                          <Form.HelpText>
                            This discount will be used to calculate the payable
                            amount during billing.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" value={defaultTaxRate}/>
                          <Form.ControlLabel>
                            Set Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control
                            type="number"
                            name="taxRate"
                            placeholder="Enter tax rate here..."
                            value={dailyPlanFormData.taxRate}
                          />
                          <Form.HelpText>
                            Tax is added to the payable amount after discount
                          </Form.HelpText>
                        </Form.Group>
                        <ButtonGroup>
                          <Button appearance="primary" type="submit" size="sm">
                            Save Plan Settings
                          </Button>
                        </ButtonGroup>
                      </Form>
                    </Panel>
                  </Tabs.Tab>
                  <Tabs.Tab eventKey="2">
                    <Panel bordered>
                      <Form
                        fluid
                        onSubmit={handleSubmitWeeklyPlan}
                        formValue={weeklyPlanFormData}
                        onChange={handleWeeklyPlanFormChange}
                      >
                        <Form.Group>
                          <Form.ControlLabel>
                            Weekly Plan Description
                          </Form.ControlLabel>
                          <Form.Control
                            rows={5}
                            name="description"
                            accepter={Textarea}
                            value={weeklyPlanFormData.description}
                            Placeholder="Enter weekly plan description here..."
                          />
                          <Form.HelpText>
                            Add a detailed description of the plan, it will
                            visible to customers subscribing and recording
                            sales.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Weekly Discount (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" value={defaultDiscount}/>
                          <Form.ControlLabel>
                            Set Weekly discount (%)
                          </Form.ControlLabel>
                          <Form.Control
                            type="number"
                            name="discount"
                            placeholder="Enter weekly discount here"
                            value={weeklyPlanFormData.discount}
                          />
                          <Form.HelpText>
                            This discount will be used to calculate the payable
                            amount during billing.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Weekly Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" value={defaultTaxRate}/>
                          <Form.ControlLabel>
                            Set Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control
                            name="taxRate"
                            type="number"
                            placeholder="Enter tax rate here..."
                            value={weeklyPlanFormData.taxRate}
                          />
                          <Form.HelpText>
                            Tax is added to the payable amount after discount
                          </Form.HelpText>
                        </Form.Group>
                        <ButtonGroup>
                          <Button appearance="primary" type="submit" size="sm">
                            Save Plan Settings
                          </Button>
                        </ButtonGroup>
                      </Form>
                    </Panel>
                  </Tabs.Tab>
                  <Tabs.Tab eventKey="3">
                    <Panel bordered>
                      <Form
                        fluid
                        onSubmit={handleSubmitMonthlyPlan}
                        formValue={monthlyPlanFormData}
                        onChange={handleMonthlyPlanFormChange}
                      >
                        <Form.Group>
                          <Form.ControlLabel>
                            Monthly Plan Description
                          </Form.ControlLabel>
                          <Form.Control
                            rows={5}
                            name="description"
                            accepter={Textarea}
                            value={monthlyPlanFormData.description}
                            Placeholder="Enter monthly plan description"
                          />
                          <Form.HelpText>
                            Add a detailed description of the plan, it will
                            visible to customers subscribing and recording
                            sales.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Monthly Discount (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" value={defaultDiscount}/>
                          <Form.ControlLabel>
                            Set discount (%)
                          </Form.ControlLabel>
                          <Form.Control
                            name="discount"
                            type="number"
                            placeholder="Enter monthly discount here"
                            value={monthlyPlanFormData.discount}
                          />
                          <Form.HelpText>
                            This discount will be used to calculate the payable
                            amount during billing.
                          </Form.HelpText>
                        </Form.Group>

                        <Form.Group>
                          <Form.ControlLabel>
                            Current Monthly Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control readOnly type="number" value={defaultTaxRate}/>
                          <Form.ControlLabel>
                            Set Tax Rate (%)
                          </Form.ControlLabel>
                          <Form.Control
                            name="taxRate"
                            type="number"
                            placeholder="Enter monthly tax rate here"
                            value={monthlyPlanFormData.taxRate}
                          />
                          <Form.HelpText>
                            Tax is added to the payable amount after discount
                          </Form.HelpText>
                        </Form.Group>
                        <ButtonGroup>
                          <Button appearance="primary" type="submit" size="sm">
                            Save Plan Settings
                          </Button>
                        </ButtonGroup>
                      </Form>
                    </Panel>
                  </Tabs.Tab>
                </Tabs>
              </Col>
            </Row>
          </Content>
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
        </Container>
      </Container>
    </div>
  );
};

export default ManageSales;
