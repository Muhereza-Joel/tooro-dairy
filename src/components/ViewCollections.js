import React, { useState, useEffect } from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
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

const ViewCollections = (props) => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [role, setRole] = useState(null);
  // State to track the user being edited
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [open, setOpen] = React.useState(false);
  const [collectionToView, setCollectionToView] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleOpen = (collectionId) => {
    setOpen(true);
    setEditingCollectionId(collectionId);
    const collection = originalData.find(
      (collection) => collection.id === collectionId
    );
    setCollectionToView(collection);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/stock/collections"
        );
        const collections = await response.json();
        setOriginalData(collections); // Store original data
        setData(collections); // Initialize displayed data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userCookie = Cookies.get("tdmis");

    if (userCookie) {
      try {
        const userDataFromCookie = JSON.parse(userCookie);

        setRole(userDataFromCookie.role);

        if (typeof userDataFromCookie === "object") {
        } else {
          console.error("Invalid user data format in the cookie");
        }
      } catch (error) {
        console.error("Error parsing JSON from the cookie:", error);
      }
    }
  }, []);

  const isAdmin = role === "administrator";
  const isUser = role === "user";

  const handleDelete = (collectionId) => {
    setEditingCollectionId(collectionId);
    setDeleteModal(true);
  };

  const handleEdit = (userId) => {
    setEditingCollectionId(userId);

    const userToEdit = originalData.find((user) => user.id === userId);
    setEditFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      role: userToEdit.role,
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
  }, [selectedFilter, selectedStatus]);

  const handleSearch = (value) => {
    // Use originalData for searching
    const filteredData = originalData.filter((item) => {
      const includesValue = Object.values(item).some(
        (val) =>
          val && val.toString().toLowerCase().includes(value.toLowerCase())
      );

      const filterCondition =
        selectedFilter && item.stock_plan === selectedFilter;
      const statusCondition = selectedStatus && item.status === selectedStatus;

      // Combine filter, stock_plan, status, and search conditions
      return (
        (includesValue && filterCondition && statusCondition) ||
        (selectedFilter &&
          !selectedStatus &&
          includesValue &&
          filterCondition) ||
        (!selectedFilter &&
          selectedStatus &&
          includesValue &&
          statusCondition) ||
        (!selectedFilter && !selectedStatus && includesValue)
      );
    });

    setData(filteredData);
  };

  const markCollectionAsPaid = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/stock/collections/mark-as-paid/${id}`,
        {
          method: "PUT",
        }
      );
  
      if (response.ok) {
        const updatedData = data.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: "paid", 
              balance: 0,
              amount_paid: 0, 
            };
          }
          return item;
        });
  
        setData(updatedData);
        setOpen(false);
        toast.success("Collection marked as paid successfully.", {
          style: { backgroundColor: "#66ff66", color: "#333" },
        });
      } else {
        toast.error("Error marking collection as paid. Please try again later.", {
          style: { backgroundColor: "#ff6666", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        style: { backgroundColor: "#ff6666", color: "#333" },
      });
    }
  };
  

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/stock/collections/${editingCollectionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted user from the data in the table
        const updatedData = data.filter(
          (user) => user.id !== editingCollectionId
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
                  Showing All Collections{" "}
                  <Form>
                    <Form.Control
                      placeholder="Search..."
                      onChange={(value) => handleSearch(value)}
                    />
                  </Form>
                </Col>
                <Col xs={5}>
                  Filter by stock plan{" "}
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
                <Col xs={5}>
                  Filter by payement status{" "}
                  <Stack
                    spacing={10}
                    direction="column"
                    alignItems="flex-start"
                  >
                    <SelectPicker
                      data={["paid", "not-paid", "has-balance"].map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      style={{ width: 224 }}
                      onChange={(value) => setSelectedStatus(value)}
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
                    <Cell dataKey="username" style={{ fontSize: "1.0rem" }} />
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
                      Buying Price
                    </HeaderCell>
                    <Cell
                      dataKey="buying_price"
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
                      Stock Plan
                    </HeaderCell>
                    <Cell dataKey="stock_plan" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={150} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Status
                    </HeaderCell>
                    <Cell dataKey="status" style={{ fontSize: "1.0rem" }} />
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
                        const collectionId = rowData.id;
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
                              onClick={() => handleOpen(collectionId)}
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
                <Modal.Title>Collection Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {collectionToView === null ? (
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
                              src={collectionToView.url || Avator}
                              width={200}
                              height={200}
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />

                            <Form.Group>
                              <Form.ControlLabel>
                                Client Username
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.username}
                              />
                            </Form.Group>

                            <Form.Group>
                              <Form.ControlLabel>
                                Product Name
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.product_name}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Stock Plan</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.stock_plan}
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group style={{ marginTop: "2rem" }}>
                              <Form.ControlLabel>
                                Collection Status
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.status}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>
                                Quantity Stocked
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.quantity}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Amount Paid</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.amount_paid}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>Balance</Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.balance}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.ControlLabel>
                                Total Amount
                              </Form.ControlLabel>
                              <Form.Control
                                readOnly
                                value={collectionToView.total}
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

                { (isAdmin || isUser) && <Button onClick={() => markCollectionAsPaid(editingCollectionId)}>Mark As Paid</Button>}

                {isAdmin && (
                  <Button
                    color="red"
                    appearance="primary"
                    onClick={() => handleDelete(editingCollectionId)}
                  >
                    Delete Stock Record
                  </Button>
                )}
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
                  data atached to this collection, Continue with caution because
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

export default ViewCollections;
