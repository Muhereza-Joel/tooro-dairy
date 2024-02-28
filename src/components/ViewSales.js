import React, { useState, useEffect } from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avator from "../assets/images/avator.jpg";
import {
  Container,
  Content,
  Row,
  Col,
  Header,
  Sidebar,
  Form,
  Placeholder,
  Table,
  Button,
  Footer,
  Pagination,
  Stack,
  SelectPicker,
  ButtonGroup,
  Modal,
  Loader,
  Panel,
  Message,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const selectPickerData = ["daily", "weekly", "monthly"].map((item) => ({
  label: item,
  value: item,
}));

const { Column, HeaderCell, Cell } = Table;

const ViewSales = (props) => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  // State to track the user being edited
  const [editingrecordId, setEditingRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [open, setOpen] = React.useState(false);
  const [recordToView, setRecordToView] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleOpen = (recordId) => {
    setOpen(true);
    setEditingRecordId(recordId);
    const record = originalData.find(
      (record) => record.id === recordId
    );
    setRecordToView(record);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/sales/all"
        );
        const records = await response.json();
        setOriginalData(records); // Store original data
        setData(records); // Initialize displayed data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (recordId) => {
    setEditingRecordId(recordId);
    setDeleteModal(true);
  };

  const handleEdit = (recordId) => {
    setEditingRecordId(recordId);

    const recordToEdit = originalData.find((record) => record.id === recordId);
    setEditFormData({
      username: recordToEdit.username,
      email: recordToEdit.email,
      role: recordToEdit.role,
    });
  };

  const getData = () => {
    if (sortColumn && sortType) {
      return [...data].sort((a, b) => {
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
    return data;
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

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    setPage(1);

    // If no filter is selected, reset the data to the original set
    if (!value) {
      setData(originalData);
    }
  };

  useEffect(() => {
    handleSearch(""); // Trigger search when selectedFilter or selectedStatus changes
  }, [selectedFilter]);
  

  const handleSearch = (value) => {
    // Use originalData for searching
    const filteredData = originalData.filter((item) => {
      const includesValue = Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      );
  
      const filterCondition = selectedFilter && item.sales_plan === selectedFilter;
  
      // Combine filter, stock_plan, status, and search conditions
      return (
        (includesValue && filterCondition) ||
        (selectedFilter && includesValue && filterCondition) ||
        (!selectedFilter && includesValue) ||
        (!selectedFilter && includesValue)
      );
    });
  
    setData(filteredData);
  };
  
  

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/sales/delete/${editingrecordId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted user from the data in the table
        const updatedData = data.filter(
          (user) => user.id !== editingrecordId
        );
        setData(updatedData);
        setDeleteModal(false);
        setOpen(false);
        toast.success("Record Deleted Successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });
      } else {
        toast.error("Error deleting record. Please try again later.", {
          style: { backgroundColor: "#ff6666", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Error deleting record. Please try again later.", {
        style: { backgroundColor: "#ff6666", color: "#333" },
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
            <div className="show-grid">
              <Row className="show-grid">
                <Col xs={6}>
                  Showing All Sale Records{" "}
                  <Form>
                    <Form.Control
                      placeholder="Search..."
                      onChange={(value) => handleSearch(value)}
                    />
                  </Form>
                </Col>
                <Col xs={5}>
                  Filter by sales plan{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      data={selectPickerData}
                      style={{ width: 224 }}
                      onChange={handleFilterChange}
                    />
                  </Stack>
                </Col>
                
                <Col xs={8} style={{ marginTop: "1.2rem" }}>
                  <ButtonGroup>
                    <Button>Export To Pdf</Button>
                    <Button>Export To CSV</Button>
                    <Button>Export To Excel</Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: 10, display: "flex", gap: "5px" }}>
              {/* Position For Buttons to export PDF and Excel */}
            </div>
            <div>
              {data.length === 0 ? (
                <div>
                  <Placeholder.Grid rows={10} columns={6} active />
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
                    <Cell dataKey="phone_number" style={{ fontSize: "1.0rem" }} />
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
                    <Cell dataKey="sales_plan" style={{ fontSize: "1.0rem" }} />
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

                  <Column width={150} fixed="right">
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Action
                    </HeaderCell>
                    <Cell>
                      {(rowData, rowIndex) => {
                        const recordId = rowData.id;
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Button
                              style={{ cursor: "pointer" }}
                              appearance="danger"
                              onClick={() => handleOpen(recordId)}
                            >
                              View Details
                            </Button>
                          </div>
                        );
                      }}
                    </Cell>
                  </Column>
                </Table>
              )}
            </div>
            <Modal open={open} onClose={handleClose}>
              <Modal.Header>
                <Modal.Title>Sales Record Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {recordToView === null ? (
                  <div style={{ textAlign: "center" }}>
                    <Loader md />
                  </div>
                ) : (
                  <div>
                    <Panel>
                      <Form fluid>
                        <Row className="show-grid">
                          <Col xs={12}>
                            <img
                              src={recordToView.url || Avator}
                              width={200}
                              height={200}
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />

                            <Form.Group>
                              <Form.ControlLabel>
                                Client Full Name
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.fullname}
                              />
                            </Form.Group>

                            <Form.Group>
                              <Form.ControlLabel>
                                Product Name
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.product_name}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Phone Number</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.phone_number}
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group style={{ marginTop: "2rem" }}>
                              <Form.ControlLabel>
                                Sales Plan
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.sales_plan}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>
                                Quantity Sold
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.quantity}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Tax Amount</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.tax_amount}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Discount Amount</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.discount_amount}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>
                                Total Amount
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={recordToView.total}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </Panel>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                  Hide
                </Button>
                <Button
                  color="red"
                  appearance="primary"
                  onClick={() => handleDelete(editingrecordId)}
                >
                  Delete Sale Record
                </Button>
                <Button onClick={handleClose} appearance="subtle">
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              open={deleteModal}
              onClose={() => setDeleteModal(false)}
              size="sm"
            >
              <Modal.Header>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Message showIcon type="error" style={{ marginBottom: "15px" }}>
                  <strong>Note: </strong>Deleting this record will delete all
                  data atached to this record, Continue with caution because
                  this action is undoable...
                </Message>
                Are you sure you want to continue with this action?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setDeleteModal(false)}
                  appearance="subtle"
                >
                  Cancel
                </Button>
                <Button appearance="primary" onClick={handleDeleteSubmit}>
                  Yes, Delete Record
                </Button>
              </Modal.Footer>
            </Modal>
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
          <Footer
            style={{
              height: "10vh",
              position: "sticky",
              bottom: 20,
              zIndex: 1000,
            }}
          >
            <div style={{ padding: 20 }}>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="md"
                layout={["total", "-", "limit", "|", "pager", "skip"]}
                total={Math.ceil(data.length)} // Adjust total for pages
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </Footer>
        </Container>
      </Container>
    </div>
  );
};

export default ViewSales;
