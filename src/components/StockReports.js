import React, { useState, useEffect } from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avator from "../assets/images/avator.jpg";
import Cookies from "js-cookie";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

import {
  Col,
  Container,
  Content,
  DatePicker,
  Form,
  Header,
  Row,
  SelectPicker,
  Sidebar,
  Stack,
  Table,
  RadioTile,
  RadioTileGroup,
  useMediaQuery,
  Divider,
  Placeholder,
} from "rsuite";

const { Column, HeaderCell, Cell } = Table;
const salesPlanPickerData = ["daily", "weekly", "monthly"].map(
  (item) => ({
    label: item,
    value: item,
  })
);

const statusPickerData = ["paid", "not-paid", "has-balance"].map(
  (item) => ({
    label: item,
    value: item,
  })
);

const StockReports = (props) => {
  const [isInline] = useMediaQuery("xl"); // (min-width: 1200px)
  const [selectedTile, setSelectedTile] = useState("daily");
  const [selectedSalesPlan, setSelectedSalesPlan] = useState(null);
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value) => {};

  const handleTileChange = (value) => {
    setSelectedTile(value);
  };

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
    value: item.product_name,
  }));

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.id === value);
    setSelectedProduct(selected);
  };

  const handlePlanChange = (value) => {
    setSelectedSalesPlan(value);
  };
  const handleStatusChange = (value) => {
    setStatus(value);
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
            <div className="show-grid">
              <Row className="show-grid">
                <RadioTileGroup
                  value={selectedTile}
                  onChange={handleTileChange}
                  inline={isInline}
                  aria-label="Create new project"
                >
                  <RadioTile label="Daily Stock Reports" value="daily">
                    Use this tile to get all stock data for today.
                  </RadioTile>
                  <RadioTile label="Weekly Stock Reports" value="weekly">
                    Use this tile to get all stock data for a week.
                  </RadioTile>
                  <RadioTile label="Monthly Stock Reports" value="monthly">
                    Use this tile to get all stock data for a month.
                  </RadioTile>
                  <RadioTile label="Custom Stock Reports" value="custom">
                    Select date ranges to obtain stock data.
                  </RadioTile>
                </RadioTileGroup>
              </Row>
              <Divider />
              <Row className="show-grid">
                <Col xs={6}>
                  Dynamically Generate reports using filters{" "}
                  <Form>
                    <Form.Control
                      placeholder="Search..."
                      onChange={handleSearch}
                    />
                  </Form>
                </Col>
                <Col xs={3}>
                  Filter by stock plan{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      label="Plan"
                      data={salesPlanPickerData}
                      style={{ width: 150 }}
                    />
                  </Stack>
                </Col>
                <Col xs={3}>
                  Filter by product name{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      onChange={handleProductChange}
                      label="Product"
                      data={data}
                      style={{ width: 150 }}
                    />
                  </Stack>
                </Col>
                <Col xs={3}>
                  Filter by status{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      onChange={handleProductChange}
                      label="Product"
                      data={statusPickerData}
                      style={{ width: 150 }}
                    />
                  </Stack>
                </Col>

                {selectedTile === "custom" && (
                  <>
                    <Col xs={3}>
                      Filter by start date{" "}
                      <Stack
                        spacing={10}
                        direction="column"
                        alignItems="flex-start"
                      >
                        <DatePicker style={{ width: 150 }} />
                      </Stack>
                    </Col>
                    <Col xs={3}>
                      Filter by end date{" "}
                      <Stack
                        spacing={10}
                        direction="column"
                        alignItems="flex-start"
                      >
                        <DatePicker style={{ width: 150 }} />
                      </Stack>
                    </Col>
                  </>
                )}
              </Row>
              <div>
                {salesData.length == 0 ? (
                  <div style={{ marginTop: 30 }}>
                    <Placeholder.Grid rows={10} active />
                  </div>
                ) : (
                  <Table loading={loading} style={{ marginTop: 30 }}>
                    <Column></Column>
                  </Table>
                )}
              </div>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
};


export default StockReports;
