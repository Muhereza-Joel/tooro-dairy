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
  Button,
} from "rsuite";
import SalesPDFModal from "./SalesPDFModal";
import SalesPDFGenerator from "./SalesPDFGenerator";

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
  const [selectKey, setSelectKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchEndpoint, setFetchEndpoint] = useState(
    "http://localhost:3002/tdmis/api/v1/sales/reports/daily"
  );

  const [openPdfModal, setOpenPdfModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  const handleGeneratePDF = () => {
    try {
      const pdfDoc = <SalesPDFGenerator data={salesData} />;

      setPdfData(pdfDoc);
      setOpenPdfModal(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    // Fetch data when fetchEndpoint changes
    fetchData();
  }, [selectKey]);

  const updateFetchEndpoint = (
    value,
    salesPlan,
    productName,
    startDate,
    endDate
  ) => {
    const baseUrl = "http://localhost:3002/tdmis/api/v1/sales/reports";
    let newEndpoint = baseUrl;

    switch (value) {
      case "daily":
        newEndpoint += "/daily";
        break;
      case "weekly":
        newEndpoint += "/weekly";
        break;
      case "monthly":
        newEndpoint += "/monthly";
        break;
      case "custom":
        newEndpoint += "/custom";
        break;
      default:
        newEndpoint += "/daily";
        break;
    }

    const queryString = buildQueryString(
      salesPlan,
      productName,
      startDate,
      endDate
    );
    setFetchEndpoint(
      queryString ? `${newEndpoint}?${queryString}` : newEndpoint
    );
  };

  const buildQueryString = (salesPlan, productName, startDate, endDate) => {
    const queryParams = new URLSearchParams();
    if (salesPlan) queryParams.set("salesPlan", salesPlan);
    if (productName) queryParams.set("productName", productName);
    if (startDate) queryParams.set("startDate", startDate);
    if (endDate) queryParams.set("endDate", endDate);

    return queryParams.toString();
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
    }, 500);
  };

  const data = products.map((item) => ({
    label: item.product_name,
    value: item.product_name,
  }));

  const handleTileChange = (value) => {
    setSelectedTile(value);
    updateFetchEndpoint(
      value,
      selectedSalesPlan,
      selectedProductName,
      startDate,
      endDate
    );
    setSelectKey((prevKey) => prevKey + 1);
    // setSelectedSalesPlan(null);
    // setSelectedProductName(null);
    // setStartDate(null);
    // setEndDate(null);
  };

  const handlePlanChange = (value) => {
    setSelectedSalesPlan(value);
    updateFetchEndpoint(
      selectedTile,
      value,
      selectedProductName,
      startDate,
      endDate
    );
  };

  const handleProductChange = (value) => {
    const selected = products.find((product) => product.product_name === value);
    setSelectedProduct(selected);
    setSelectedProductName(selected != null ? selected.product_name : "");
    updateFetchEndpoint(
      selectedTile,
      selectedSalesPlan,
      value,
      startDate,
      endDate
    );
  };

  const handleStartDateChange = (value) => {
    const startDateObj = new Date(value);
    let startDate = startDateObj.toISOString().split("T")[0];
    setStartDate(startDate);
    updateFetchEndpoint(
      selectedTile,
      selectedSalesPlan,
      selectedProductName,
      startDate,
      endDate
    );
  };

  const handleEndDateChange = (value) => {
    const endDateObj = new Date(value);
    let endDate = endDateObj.toISOString().split("T")[0];
    setEndDate(endDate);
    updateFetchEndpoint(
      selectedTile,
      selectedSalesPlan,
      selectedProductName,
      startDate,
      endDate
    );
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
                        <DatePicker
                          style={{ width: 150 }}
                          onChange={handleStartDateChange}
                        />
                      </Stack>
                    </Col>
                    <Col xs={3}>
                      Filter by end date{" "}
                      <Stack
                        spacing={10}
                        direction="column"
                        alignItems="flex-start"
                      >
                        <DatePicker
                          style={{ width: 150 }}
                          onChange={handleEndDateChange}
                        />
                      </Stack>
                    </Col>
                  </>
                )}
                <Col xs={3}>
                  <Button style={{ marginTop: "20px" }} onClick={fetchData}>
                    Search Database
                  </Button>
                </Col>
                <Col>
                  <Button appearance="primary" onClick={() => handleGeneratePDF()} style={{marginTop: "20px"}}>
                    Export To Pdf
                  </Button>
                </Col>
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
            <SalesPDFModal
              openPdfModal={openPdfModal}
              pdfData={pdfData}
              onClose={() => setOpenPdfModal(false)}
            />
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default SalesReports;
