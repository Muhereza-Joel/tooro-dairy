import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Container,
  Sidebar,
  Content,
  Header,
  Placeholder,
  Footer,
  Form,
  Button,
  FlexboxGrid,
  Modal,
  InputPicker,
  Message,
  Schema,
} from "rsuite";
import SideNav from "./SideNav";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const nameRule = Schema.Types.StringType().isRequired(
  "The username is required."
);
const emailRule = Schema.Types.StringType()
  .isEmail("Please enter a valid email address.")
  .isRequired("Email is required");
const { Column, HeaderCell, Cell } = Table;
const selectData = ["administrator", "customer", "user"].map((item) => ({
  label: item,
  value: item,
}));

const Users = (props) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  // State to track the user being edited
  const [editingUserId, setEditingUserId] = useState(null);

  // State for edit form values
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

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
    }, 500);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const handleSearch = (value) => {
    // Use originalData for searching
    const filteredData = originalData.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/auth/users"
        );
        const users = await response.json();
        setOriginalData(users); // Store original data
        setData(users); // Initialize displayed data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (userId) => {
    setEditingUserId(userId);
    setDeleteModal(true);
  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    setEditModal(true);

    const userToEdit = originalData.find((user) => user.id === userId);
    setEditFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      role: userToEdit.role,
    });
  };

  const handleEditSubmit = async () => {
    try {
      // Send a PUT request to the server with the updated user details
      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/auth/user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingUserId,
            username: editFormData.username,
            email: editFormData.email,
            role: editFormData.role,
          }),
        }
      );
      const newData = await response.json();

      if (response.ok) {
        if (!newData || !newData.errors) {
          const updatedData = data.map((user) =>
            user.id === editingUserId
              ? {
                  ...user,
                  username: newData.username,
                  email: newData.email,
                  role: newData.role,
                }
              : user
          );
          setData(updatedData);
          setEditModal(false);
          toast.success("User Details Changed Successfully...", {
            style: { backgroundColor: "#cce6e8", color: "#333" },
          });
        } else {
          const errors = newData.errors;

          // Iterate through the keys of errors object
          Object.keys(errors).forEach((errorType) => {
            const errorMessage = errors[errorType];

            // Display a toast for each error
            toast.error(`${errorMessage}`, {
              style: { backgroundColor: "#fcd0d0", color: "#333" },
            });
          });
        }
      } else {
        toast.error("Error updating user. Please try again later.", {
          style: { backgroundColor: "#ff6666", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Error updating user. Please try again later.", {
        style: { backgroundColor: "#ff6666", color: "#333" },
      });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/auth/user/${editingUserId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted user from the data in the table
        const updatedData = data.filter((user) => user.id !== editingUserId);
        setData(updatedData);
        setDeleteModal(false);
        toast.success("User Details Deleted Successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });
      } else {
        toast.error("Error deleting user. Please try again later.", {
          style: { backgroundColor: "#ff6666", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Error deleting user. Please try again later.", {
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
            <div className="show-grid">
              <FlexboxGrid style={{ margin: "10px 25px" }}>
                <FlexboxGrid.Item
                  colspan={12}
                  style={{ fontSize: "1.2rem" }}
                ></FlexboxGrid.Item>
                <FlexboxGrid.Item
                  colspan={12}
                  style={{ textAlign: "end", fontSize: "1.3rem" }}
                >
                  Hello, Miria
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>
          </Header>
          <Content
            style={{ height: "90vh", padding: "0px 20px", overflow: "auto" }}
          >
            <div className="show-grid">
              <FlexboxGrid style={{ marginBottom: 10 }}>
                <FlexboxGrid.Item style={{ fontSize: "1.5rem" }} colspan={6}>
                  Showing All System Users
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                  <Form>
                    <Form.Control
                      placeholder="Search..."
                      onChange={(value) => handleSearch(value)}
                    />
                  </Form>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>
            <div
              style={{ marginBottom: 10, display: "flex", gap: "5px" }}
            ></div>
            {data.length === 0 ? (
              <div>
                <Placeholder.Grid rows={10} columns={6} active />
              </div>
            ) : (
              <div>
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

                  <Column width={200} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Username
                    </HeaderCell>
                    <Cell dataKey="username" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={200} resizable sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Email
                    </HeaderCell>
                    <Cell dataKey="email" style={{ fontSize: "1.0rem" }} />
                  </Column>

                  <Column width={200} sortable>
                    <HeaderCell
                      style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                      Role
                    </HeaderCell>
                    <Cell dataKey="role" style={{ fontSize: "1.0rem" }} />
                  </Column>
                  <Column width={200} flexGrow={1}>
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Added On
                    </HeaderCell>
                    <Cell style={{ fontSize: "1.0rem" }}>
                      {moment(data.created_at).format("MMMM D, YYYY")}
                    </Cell>
                  </Column>
                  <Column width={200} flexGrow={1}>
                    <HeaderCell
                      style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Last Updated On
                    </HeaderCell>
                    <Cell style={{ fontSize: "1.0rem" }}>
                      {moment(data.updated_at).format("MMMM D, YYYY")}
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
                        const userId = rowData.id; // Assuming there's an 'id' field in your data
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Button
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEdit(userId)}
                              appearance="link"
                            >
                              Edit
                            </Button>
                            <Button
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDelete(userId)}
                              appearance="danger"
                            >
                              Delete
                            </Button>
                          </div>
                        );
                      }}
                    </Cell>
                  </Column>
                </Table>
              </div>
            )}

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
                  <strong>Note: </strong>Deleting a user will delete all data
                  atached to this user, Continue with caution because this
                  action is undoable...
                </Message>
                Are you sure you want to delete this user?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setDeleteModal(false)}
                  appearance="subtle"
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteSubmit} appearance="primary">
                  Yes, Delete User
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal
              open={editModal}
              onClose={() => setEditModal(false)}
              size="sm"
            >
              <Modal.Header>
                <Modal.Title>Edit User Information</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Message
                  showIcon
                  type="warning"
                  style={{ marginBottom: "15px" }}
                >
                  <strong>Note: </strong>The username will be stored in
                  lowercase and separated by hythens.
                </Message>
                <Form fluid onSubmit={handleEditSubmit}>
                  <Form.Group>
                    <Form.Control
                      name="username"
                      value={editFormData.username}
                      onChange={(value) =>
                        setEditFormData({ ...editFormData, username: value })
                      }
                      placeholder="Username"
                      rule={nameRule}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      name="email"
                      value={editFormData.email}
                      onChange={(value) =>
                        setEditFormData({ ...editFormData, email: value })
                      }
                      placeholder="Email"
                      rule={emailRule}
                    />
                  </Form.Group>
                  <Form.Group>
                    <div>
                      <InputPicker
                        name="role"
                        data={selectData}
                        onChange={(value) =>
                          setEditFormData({ ...editFormData, role: value })
                        }
                        block
                      />
                    </div>
                  </Form.Group>
                  <div style={{ textAlign: "end" }}>
                    <Button type="submit" appearance="primary">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditModal(false)}
                      appearance="subtle"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
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

export default Users;
