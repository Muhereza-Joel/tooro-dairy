import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Content,
  Grid,
  Header,
  Row,
  Sidebar,
  Steps,
  Col,
  Panel,
  Form,
  Button,
  ButtonToolbar,
  Placeholder,
  Input,
  RadioTileGroup,
  RadioTile,
  Divider,
  SelectPicker,
  DatePicker,
  Message,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import Avator from "../assets/images/avator.jpg";

const Subscriptions = (props) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState(null);
  const [selectedSalesPlan, setSelectedSalesPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [filteredPlan, setFilteredPlan] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [maxStartDate, setMaxStartDate] = useState(new Date());
  const [selectKey, setSelectKey] = useState(0);
  const [searchData, setSearchData] = useState({
    searchTerm: "",
  });

  const [formData, setFormData] = useState({
    quantity: 0,
    unitPrice: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/stock/products"
        );
        if (response.ok) {
          const products = await response.json();
          setProducts(products);
          // Set the maxStartDate to today
          setMaxStartDate(new Date());
        } else {
          toast.error("Failed to load products from the server...", {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
        }
      } catch (error) {
        toast.error("Failed to connect to the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/sales/sales-settings"
        );
        if (response.ok) {
          const salePlans = await response.json();
          setPlans(salePlans);
        } else {
          toast.error("Failed to load products from the server...", {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
        }
      } catch (error) {
        toast.error("Failed to connect to the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const data = products.map((item) => ({
    label: item.product_name,
    value: item.id,
  }));

  const handleFormChange = (formValue) => {
    const { quantity, startDate } = formValue;

    let endDate = "";
    if (startDate && filteredPlan) {
      const daysToAdd = filteredPlan.name === "weekly" ? 7 : 30;
      const startDateObj = new Date(startDate);
      const startDateObj2 = new Date(startDate);
      startDateObj.setDate(startDateObj.getDate() + daysToAdd);
      endDate = startDateObj.toISOString().split("T")[0];
      const formattedStartDate = startDateObj2.toISOString().split("T")[0];

      setFormData({
        ...formValue,
        startDate: formattedStartDate,
        endDate: endDate,
      });
    }

    if (selectedProduct && selectedProduct.selling_price && filteredPlan) {
      // Calculate the total based on quantity and sales plan
      const totalPerDay = selectedProduct.selling_price * quantity;

      const total =
        filteredPlan.name === "weekly" ? totalPerDay * 7 : totalPerDay * 30;
      const discount = filteredPlan.discount;
      const taxRate = filteredPlan.tax_rate;

      // Calculate discounted amount
      const discountedAmount = (total * discount) / 100;

      // Calculate tax amount
      const taxAmount = (total * taxRate) / 100;

      // Calculate final total amount after discount and tax
      const finalTotal = total - (discountedAmount + taxAmount);

      setFormData({
        ...formValue,
        total: finalTotal,
        discountAmount: discountedAmount,
        taxAmount: taxAmount,
      });
    }
  };

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.id === value);
    setSelectedProduct(selected);
    setFormData({
      ...formData,
      quantity: 0,
      unitPrice: "",
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
    });
  };

  const handleSearchForm = (formValue) => {
    setSearchData(formValue);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/auth/profile?username=${searchData.searchTerm}`
      );

      if (response.ok) {
        const profileData = await response.json();
        if (Array.isArray(profileData) && profileData.length > 0) {
          setUserData(profileData[0]);
          setStep(1);
        } else {
          toast.error("Failed to get user data...", {
            style: { backgroundColor: "#fcd0d0", color: "#333" },
          });
          setUserData(null);
        }
      } else {
        toast.error("Failed to get user data...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
      console.error(error);
    }
  };

  const handleSalesPlanChange = (value) => {
    setSelectedSalesPlan(value);
    setStep(2);
    setSelectKey((prevKey) => prevKey + 1);
    setSelectedProduct({});

    const selectedPlan = plans.find((plan) => plan.name === value);
    setFilteredPlan(selectedPlan);
    setFormData({
      quantity: "",
      unitPrice: "",
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
      startDate: "",
      endDate: "",
    });
  };

  const handleFormSubmit = async () => {
    try {
      const { id: userId } = userData;
      const productId = selectedProduct ? selectedProduct.id : null;

      const requestBody = {
        ...formData,
        salesPlan: selectedSalesPlan,
        userId: userId,
        productId: productId,
        unitPrice: selectedProduct.selling_price,
        // startDate: formData.startDate,
        // endDate: formData.endDate,
      };

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/sales/subscriptions/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Subscription saved successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });

        setFormData({
          quantity: 0,
          unitPrice: 0,
          discountAmount: 0,
          taxAmount: 0,
          total: 0,
          startDate: "",
          endDate: "",
        });

        setSelectedSalesPlan(null);
        setUserData(null);
        setSearchData({ searchTerm: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };

  const avatorStyle = {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    border: "2px solid #299ea6",
    marginTop: "0rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
    borderRadius: "50%",
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
            <Grid fluid>
              <Message
                showIcon
                type="warning"
                header="Warning"
                style={{ marginBottom: "30px" }}
              >
                <strong>
                  Please make sure to set the subscription plan for a user when
                  his current plan has ended, because setting a new plan will
                  close all running plans for the user.
                </strong>
              </Message>

              <Steps current={step} style={{ margin: "10px 0px 50px" }}>
                <Steps.Item title="Search Customer" />
                <Steps.Item title="Select Sale Plan" />
                <Steps.Item title="Save Subscription" />
              </Steps>

              <Row className="show-grid">
                <Col md={8} sm={8} lg={8}>
                  <Panel bordered>
                    <Form
                      fluid
                      onChange={handleSearchForm}
                      onSubmit={handleSearchSubmit}
                    >
                      <Form.Group>
                        <Form.HelpText>
                          The username is assigned to every user upon
                          registration
                        </Form.HelpText>
                        <Form.Control
                          type="text"
                          placeholder="Enter username here..."
                          value={searchData.searchTerm}
                          style={{ margin: "8px 0px" }}
                          name="searchTerm"
                        />

                        <ButtonToolbar>
                          <Button
                            type="submit"
                            appearance="primary"
                            disabled={searchData.searchTerm === ""}
                          >
                            Get Details
                          </Button>
                        </ButtonToolbar>
                      </Form.Group>
                    </Form>
                  </Panel>
                  <Panel bordered style={{ marginTop: "10px" }}>
                    {!userData ? (
                      <div>
                        <Placeholder.Paragraph
                          style={{ marginTop: 30 }}
                          graph="circle"
                          active
                        />
                        <Placeholder.Paragraph
                          style={{ marginTop: 30 }}
                          graph="circle"
                          active
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ textAlign: "center" }}>
                          <img
                            src={userData.url || Avator}
                            style={avatorStyle}
                            className="rounded-circle"
                            alt="avatar"
                          />
                        </div>
                        <span>username</span>
                        <Input
                          value={userData.username}
                          style={{ marginBottom: "10px" }}
                        />
                        <span>E-mail</span>
                        <Input
                          value={userData.email}
                          style={{ marginBottom: "10px" }}
                        />
                        <span>Phone Number</span>
                        <Input
                          value={userData.phone_number}
                          style={{ marginBottom: "10px" }}
                        />
                      </div>
                    )}
                  </Panel>
                </Col>
                <Col md={8} sm={8} lg={8}>
                  <Panel bordered>
                    {userData != null ? (
                      <RadioTileGroup
                        name="salesPlan"
                        aria-label="Stock Plans"
                        value={selectedSalesPlan}
                        onChange={handleSalesPlanChange}
                      >
                        <RadioTile label="Weekly Sales Plan" value="weekly">
                          <Divider />
                          This plan applies to sales paid on a weekly basis. A
                          customer who subscribes for this plan, pays a weekly
                          bill before placing an order.
                        </RadioTile>

                        <RadioTile label="Monthly Sales Plan" value="monthly">
                          <Divider />
                          This plan applies to sales paid on a monthly basis. A
                          customer who subscribes for this plan, pays a monthly
                          bill before placing an order.
                        </RadioTile>
                      </RadioTileGroup>
                    ) : (
                      <div>
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                      </div>
                    )}
                  </Panel>
                </Col>
                <Col md={8} sm={8} lg={8}>
                  <Panel bordered>
                    {selectedSalesPlan != null ? (
                      <div>
                        <Form
                          fluid
                          onChange={handleFormChange}
                          onSubmit={handleFormSubmit}
                          formValue={formData}
                        >
                          <Row
                            fluid
                            className="show-grid"
                            style={{ marginBottom: "15px" }}
                          >
                            <Col xs={12}>
                              <Form.Group>
                                <Form.ControlLabel>
                                  Subscription start date
                                </Form.ControlLabel>
                                <DatePicker
                                  name="startDate"
                                  style={{ width: 150 }}
                                  onChange={(value) =>
                                    handleFormChange({
                                      ...formData,
                                      startDate: value,
                                    })
                                  }
                                  shouldDisableDate={(date) =>
                                    date < maxStartDate
                                  }
                                  format="yyyy-MM-dd"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group>
                                <Form.ControlLabel>
                                  Subscription end date
                                </Form.ControlLabel>
                                <Form.Control
                                  type="text"
                                  name="endDate"
                                  value={formData.endDate}
                                  readOnly
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <SelectPicker
                            key={selectKey}
                            label="Product"
                            data={data}
                            style={{ width: 500, marginBottom: "15px" }}
                            onChange={handleProductChange}
                          />
                          <Form.Group>
                            <Form.ControlLabel>
                              Unit Buying Price (Ugx)
                            </Form.ControlLabel>
                            <Form.Control
                              type="number"
                              readOnly
                              value={
                                selectedProduct
                                  ? selectedProduct.selling_price || 0
                                  : 0
                              }
                              name="unitPrice"
                            />

                            <Form.Control
                              style={{ marginTop: "30px" }}
                              type="number"
                              readOnly
                              value={filteredPlan.discount}
                              name="discount"
                            />

                            <Form.HelpText>
                              This is the discout according to the selected
                              sales plan.
                            </Form.HelpText>

                            <Form.Control
                              style={{ marginTop: "10px" }}
                              type="number"
                              readOnly
                              value={filteredPlan.tax_rate}
                              name="taxRate"
                            />

                            <Form.HelpText>
                              This is the tax rate according to the selected
                              sales plan.
                            </Form.HelpText>

                            <Form.Group style={{ marginTop: "20px" }}>
                              <Form.ControlLabel>
                                Quantity to purchase per day (liters, kgs etc)
                              </Form.ControlLabel>
                              <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                              />
                            </Form.Group>
                          </Form.Group>

                          <Form.Group>
                            <Form.ControlLabel>
                              Total Payable Amount
                            </Form.ControlLabel>
                            <Form.Control
                              type="number"
                              name="total"
                              value={formData.total}
                              readOnly
                            />
                          </Form.Group>

                          <ButtonToolbar>
                            <Button type="submit" appearance="primary">
                              Save
                            </Button>
                          </ButtonToolbar>
                        </Form>
                      </div>
                    ) : (
                      <div>
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                        <Placeholder.Paragraph
                          active
                          style={{ margin: "10px 0px" }}
                        />
                      </div>
                    )}
                  </Panel>
                </Col>
              </Row>
            </Grid>
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
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Subscriptions;
