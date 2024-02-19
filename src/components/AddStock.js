import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  ButtonToolbar,
  Col,
  Container,
  Content,
  Form,
  Grid,
  Header,
  Input,
  Panel,
  Row,
  Sidebar,
  Placeholder,
  Steps,
  SelectPicker,
  Divider,
  RadioTileGroup,
  RadioTile,
  RadioGroup,
  Radio,
  Message,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import Avator from "../assets/images/avator.jpg";

const AddStock = (props) => {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
  });

  const [formData, setFormData] = useState({
    quantity: "",
    unitPrice: "",
    amountPayed: 0,
    total: 0,
    balance: 0,
    payed: "not-paid",
  });

  const [userData, setUserData] = useState(null);
  const [selectedStockPlan, setSelectedStockPlan] = useState(null);
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/stock/products"
        );
        if (response.ok) {
          const products = await response.json();
          setProducts(products);
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

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.id === value);
    setSelectedProduct(selected);
  };

  const handlePaymentOptionChange = (value) => {
    setSelectedPaymentOption(value);
    setFormData({
      ...formData,
      payed: value,
      quantity: 0,
    });
  };

  const handleStockPlanChange = (value) => {
    setSelectedStockPlan(value);
    setFormData({
      quantity: "",
      unitPrice: "",
      amountPayed: 0,
      total: 0,
      balance: 0,
      payed: "not-paid",
    });
    setStep(2);
    setSelectKey((prevKey) => prevKey + 1);
    setSelectedProduct({});
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

  const handleFormChange = (formValue) => {
    const { quantity, payed, amountPayed } = formValue;

    const total = selectedProduct.buying_price * quantity;

    let balance = 0;
    if (selectedPaymentOption === "not-paid") {
      balance = total;
    } else if (selectedPaymentOption === "has-balance") {
      balance = total - amountPayed;
    } else if (selectedPaymentOption === "paid") {
      balance = 0;
    }

    setFormData({
      ...formValue,
      total: total,
      balance: balance,
      unitPrice: selectedProduct.buying_price,
    });
  };

  const handleFormSubmit = async () => {
    try {
      const { id: userId } = userData;
      const productId = selectedProduct ? selectedProduct.id : null;

      const requestBody = {
        ...formData,
        stockPlan: selectedStockPlan,
        userId: userId,
        productId: productId,
      };

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/stock/collections",
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
        toast.success("Collection details saved successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });

        setFormData({
          quantity: "",
          unitPrice: "",
          amountPayed: 0,
          total: 0,
          balance: 0,
          payed: "not-paid",
        });

        setSelectedStockPlan(null);
        setUserData(null);
        setSearchData({ searchTerm: "" });
      } else {
        console.error("Failed to submit form:", response.statusText);
        toast.error("Failed to connect to the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
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
              <Steps current={step} style={{ margin: "10px 0px 50px" }}>
                <Steps.Item title="Search Customer" />
                <Steps.Item title="Select Stock Plan" />
                <Steps.Item title="Record Collection" />
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
                        name="stockPlan"
                        value={selectedStockPlan}
                        onChange={handleStockPlanChange}
                        aria-label="Stock Plans"
                      >
                        <RadioTile label="Daily Stock Plan" value="daily">
                          <Divider />
                          This plan applies to stock paid on a daily basis
                        </RadioTile>

                        <RadioTile label="Weekly Stock Plan" value="weekly">
                          <Divider />
                          This plan applies to stock paid on a weekly basis
                        </RadioTile>

                        <RadioTile label="Monthly Stock Plan" value="monthly">
                          <Divider />
                          This plan applies to stock paid on a monthly basis
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
                    {selectedStockPlan != null ? (
                      <div>
                        <Message type="info" style={{ marginBottom: "10px" }}>
                          <strong>Note:</strong> When you change the stock plan,
                          you have to re fill this form again.
                        </Message>
                        <SelectPicker
                          key={selectKey}
                          label="Product"
                          data={data}
                          style={{ width: 500, marginBottom: "15px" }}
                          onChange={handleProductChange}
                        />
                        <Form
                          fluid
                          onChange={handleFormChange}
                          onSubmit={handleFormSubmit}
                          formValue={formData}
                        >
                          <Form.Group>
                            <Form.ControlLabel>
                              Unit Buying Price (Ugx)
                            </Form.ControlLabel>
                            <Form.Control
                              type="number"
                              readOnly
                              value={selectedProduct.buying_price}
                              name="unitPrice"
                            />
                          </Form.Group>

                          {selectedStockPlan === "daily" ? (
                            <div>
                              <Form.Group controlId="radioList">
                                <Form.HelpText>
                                  Mark collection as
                                </Form.HelpText>
                                <RadioGroup
                                  name="radio"
                                  inline
                                  value={selectedPaymentOption}
                                  onChange={handlePaymentOptionChange}
                                >
                                  <Radio value="not-paid">Not Paid</Radio>
                                  <Radio value="paid">Paid</Radio>
                                  <Radio value="has-balance">Has Balance</Radio>
                                </RadioGroup>
                              </Form.Group>
                            </div>
                          ) : (
                            <div></div>
                          )}

                          <Form.Group>
                            <Form.ControlLabel>
                              Quanity (litres, kgs, etc)
                            </Form.ControlLabel>
                            <Form.Control
                              type="number"
                              value={formData.quantity}
                              name="quantity"
                            />
                          </Form.Group>

                          {selectedStockPlan === "daily" ? (
                            <div>
                              {selectedPaymentOption === "not-paid" && (
                                <div>
                                  <Form.Group>
                                    <Form.ControlLabel>
                                      Balance
                                    </Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      value={formData.balance}
                                      name="balance"
                                    />
                                  </Form.Group>
                                  <Form.Group style={{ marginTop: "10px" }}>
                                    <Form.ControlLabel>Total</Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      readOnly
                                      value={formData.total}
                                      name="total"
                                    />
                                  </Form.Group>
                                </div>
                              )}

                              {selectedPaymentOption === "paid" && (
                                <div>
                                  <Form.Group style={{ marginTop: "10px" }}>
                                    <Form.ControlLabel>Total</Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      readOnly
                                      value={formData.total}
                                      name="total"
                                    />
                                  </Form.Group>
                                </div>
                              )}

                              {selectedPaymentOption === "has-balance" && (
                                <div>
                                  <Form.Group>
                                    <Form.ControlLabel>
                                      Amount Payed
                                    </Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      name="amountPayed"
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.ControlLabel>
                                      Balance
                                    </Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      value={formData.balance}
                                      name="balance"
                                    />
                                  </Form.Group>
                                  <Form.Group style={{ marginTop: "10px" }}>
                                    <Form.ControlLabel>Total</Form.ControlLabel>
                                    <Form.Control
                                      type="number"
                                      readOnly
                                      value={formData.total}
                                      name="total"
                                    />
                                  </Form.Group>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <Form.Group style={{ marginTop: "10px" }}>
                                <Form.ControlLabel>Total</Form.ControlLabel>
                                <Form.Control
                                  type="number"
                                  readOnly
                                  value={formData.total}
                                  name="total"
                                />
                              </Form.Group>
                            </div>
                          )}

                          <ButtonToolbar style={{ marginTop: "10px" }}>
                            <Button
                              appearance="primary"
                              type="submit"
                              disabled={formData.total === ""}
                            >
                              Save Record
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

export default AddStock;
