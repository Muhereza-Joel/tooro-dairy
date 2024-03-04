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
const salesPlanPickerData = ["daily", "weekly", "monthly"].map((item) => ({
  label: item,
  value: item,
}));

const SalesReports = (props) => {
  const [isInline] = useMediaQuery("xl");
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSalesPlan, setSelectedSalesPlan] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchEndpoint, setFetchEndpoint] = useState(
    "http://localhost:3002/tdmis/api/v1/sales/reports/daily"
  );

  const handleSearch = (value) => {};

  useEffect(() => {
    // Fetch data when fetchEndpoint changes
    fetchData();
  }, [fetchEndpoint]);

  const updateFetchEndpoint = (value) => {
    const baseUrl = "http://localhost:3002/tdmis/api/v1/sales/reports";

    switch (value) {
      case "daily":
        setFetchEndpoint((prevEndpoint) => {
          const newEndpoint = `${baseUrl}/daily`;
          const queryString = buildQueryString();
          return queryString ? `${newEndpoint}?${queryString}` : newEndpoint;
        });
        break;
      case "weekly":
        setFetchEndpoint((prevEndpoint) => {
          const newEndpoint = `${baseUrl}/weekly`;
          const queryString = buildQueryString();
          return queryString ? `${newEndpoint}?${queryString}` : newEndpoint;
        });
        break;
      case "monthly":
        setFetchEndpoint((prevEndpoint) => {
          const newEndpoint = `${baseUrl}/monthly`;
          const queryString = buildQueryString();
          return queryString ? `${newEndpoint}?${queryString}` : newEndpoint;
        });
        break;
      case "custom":
        setFetchEndpoint((prevEndpoint) => {
          const newEndpoint = `${baseUrl}/custom`;
          const queryString = buildQueryString();
          return queryString ? `${newEndpoint}?${queryString}` : newEndpoint;
        });
        break;
      default:
        setFetchEndpoint((prevEndpoint) => {
          const newEndpoint = `${baseUrl}/daily`;
          const queryString = buildQueryString();
          return queryString ? `${newEndpoint}?${queryString}` : newEndpoint;
        });
        break;
    }
  };

  const buildQueryString = () => {
    const queryParams = new URLSearchParams();
    if (selectedSalesPlan) queryParams.set("salesPlan", selectedSalesPlan);
    if (selectedProductName)
      queryParams.set("productName", selectedProductName);
    if (startDate) queryParams.set("startDate", startDate);
    if (endDate) queryParams.set("endDate", endDate);

    return queryParams.toString();
  };

  const handleTileChange = (value) => {
    setSelectedTile(value);
    updateFetchEndpoint(value);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(fetchEndpoint);
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      } else {
        toast.error("Failed to load sales data from the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const getData = () => {
    if (sortColumn && sortType) {
      return [...salesData].sort((a, b) => {
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
    return salesData;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
      handleSearch(""); // Reset search when sorting
    }, 500);
  };

  const data = products.map((item) => ({
    label: item.product_name,
    value: item.product_name,
  }));

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.product_name === value);
    setSelectedProduct(selected);
    setSelectedProductName(selected != null ? selected.product_name : "");
    updateFetchEndpoint(selectedTile);
  };

  const handlePlanChange = (value) => {
    setSelectedSalesPlan(value);
    updateFetchEndpoint(selectedTile);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    updateFetchEndpoint();
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    updateFetchEndpoint();
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
                  <RadioTile label="Daily Sales Reports" value="daily">
                    Use this tile to get all sales data for today.
                  </RadioTile>
                  <RadioTile label="Weekly Sales Reports" value="weekly">
                    Use this tile to get all sales data for a week.
                  </RadioTile>
                  <RadioTile label="Monthly Sales Reports" value="monthly">
                    Use this tile to get all sales data for a month.
                  </RadioTile>
                  <RadioTile label="Custom Sales Reports" value="custom">
                    Select date ranges to obtain sales data.
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
                  Filter by sales plan{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      onChange={handlePlanChange}
                      label="Plan"
                      data={salesPlanPickerData}
                      style={{ width: 150 }}
                    />
                  </Stack>
                </Col>
                <Col xs={4}>
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
                      style={{ width: 200 }}
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
                  <Table
                    autoHeight
                    data={getData().slice((page - 1) * limit, page * limit)}
                    bordered
                    cellBordered
                    sortColumn={sortColumn}
                    sortType={sortType}
                    onSortColumn={handleSortColumn}
                    loading={loading}
                    style={{ marginTop: 20 }}
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

                    <Column width={150} sortable>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Customer
                      </HeaderCell>
                      <Cell dataKey="fullname" style={{ fontSize: "1.0rem" }} />
                    </Column>

                    <Column width={150}>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Phone Number
                      </HeaderCell>
                      <Cell
                        dataKey="phone_number"
                        style={{ fontSize: "1.0rem" }}
                      />
                    </Column>

                    <Column width={170} sortable>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Product Name
                      </HeaderCell>
                      <Cell
                        dataKey="product_name"
                        style={{ fontSize: "1.0rem" }}
                      />
                    </Column>

                    <Column width={150} sortable>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Selling Price
                      </HeaderCell>
                      <Cell
                        dataKey="unit_price"
                        style={{ fontSize: "1.0rem" }}
                      />
                    </Column>
                    <Column width={120} sortable>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Quantity
                      </HeaderCell>
                      <Cell dataKey="quantity" style={{ fontSize: "1.0rem" }} />
                    </Column>

                    <Column width={130} sortable>
                      <HeaderCell
                        style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Sales Plan
                      </HeaderCell>
                      <Cell
                        dataKey="sales_plan"
                        style={{ fontSize: "1.0rem" }}
                      />
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

export default SalesReports;
