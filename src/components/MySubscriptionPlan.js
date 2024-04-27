import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  Container,
  Content,
  Grid,
  Header,
  Sidebar,
  Message,
  Tabs,
  Form,
  SelectPicker,
  Button,
  ButtonToolbar,
  Panel,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import SubscriptionDetails from "./subscriptionDetails";

const MySubscriptionPlan = (props) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filteredPlan, setFilteredPlan] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    quantity: 0,
    unitPrice: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
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
    const userCookie = Cookies.get("tdmis");

    if (userCookie) {
      try {
        const userDataFromCookie = JSON.parse(userCookie);

        setUserId(userDataFromCookie.id);

        if (typeof userDataFromCookie === "object") {
        } else {
          console.error("Invalid user data format in the cookie");
        }
      } catch (error) {
        console.error("Error parsing JSON from the cookie:", error);
      }
    }
  }, []);

  const data = products.map((item) => ({
    label: item.product_name,
    value: item.id,
  }));

  useEffect(() => {
    fetchSubscriptionData(userId);
  }, [userId]);

  
  const handleFormChange = (formValue) => {
    const { quantity } = formValue;

    if (selectedProduct && selectedProduct.selling_price) {
      const total = selectedProduct.selling_price * quantity;
     
      setFormData({
        ...formValue,
        total: total
      });
    }
  };

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.id === value);
    setSelectedProduct(selected);
    setFormData({
      quantity: 0,
      unitPrice: "",
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
    });
  };

  const fetchSubscriptionData = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/sales/subscriptions/subscription/${id}`
      );

      if (response.ok) {
        const subscription = await response.json();
        setSubscriptionPlan(subscription);
      } else {
        toast.error("No subscription plan found for the user...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const productId = selectedProduct ? selectedProduct.id : null;

      const requestBody = {
        ...formData,
        salesPlan: subscriptionPlan.sales_plan,
        userId: userId,
        productId: productId,
        unitPrice: selectedProduct.selling_price,
      };

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/orders/add",
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
        toast.success("Sale record saved successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });

        setFormData({
          quantity: 0,
          unitPrice: 0,
          discountAmount: 0,
          taxAmount: 0,
          total: 0,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
            {" "}
            <TopBar />
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <Grid fluid>
              <Tabs defaultActiveKey="1">
                <Tabs.Tab
                  eventKey="1"
                  title="Current Subscription Plan Details"
                >
                  {subscriptionPlan ? (
                    <SubscriptionDetails subscriptionPlan={subscriptionPlan} />
                  ) : (
                    <>
                      <Message type="info" style={{ marginTop: "10px" }}>
                        <h5>
                          We have i dentified that you do not have any
                          subscription plan running currently..
                        </h5>
                        <hr />
                        <p>
                          You can set the plan your self or visit the offices to
                          set up a plan for you
                        </p>
                      </Message>
                    </>
                  )}
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Create New Order">
                  <Panel bordered>
                  <Message type="success">
                    <strong>Dear consumer:</strong>
                    <hr />
                    <h6>
                      The order you are about to create, is not from the subscription plan. This is a direct order that doesnot include a discount.
                      
                    </h6>
                  </Message>
                   <br/>
                    <div>
                      <SelectPicker
                        key={selectKey}
                        label="Product"
                        data={data}
                        style={{ width: "100%", marginBottom: "15px" }}
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
                            value={
                              selectedProduct
                                ? selectedProduct.selling_price || 0
                                : 0
                            }
                            name="unitPrice"
                          />

                         

                          <Form.HelpText>
                            This is the tax rate according to the selected sales
                            plan.
                          </Form.HelpText>

                          <Form.Group style={{ marginTop: "20px" }}>
                            <Form.ControlLabel>
                              Quantity to purchase (liters, kgs etc)
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
                            Save Your Order
                          </Button>
                        </ButtonToolbar>
                      </Form>
                    </div>
                  </Panel>
                </Tabs.Tab>
              </Tabs>
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
            </Grid>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default MySubscriptionPlan;
