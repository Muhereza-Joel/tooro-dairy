import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Content,
  Header,
  Sidebar,
  Grid,
  Row,
  Col,
  Message,
  Panel,
  Form,
  ButtonToolbar,
  Button,
  Table,
  Schema,
  Modal,
} from "rsuite";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

const { Column, HeaderCell, Cell } = Table;

const productNameRule = Schema.Types.StringType().isRequired(
  "Product name is required"
);
const buyingPriceRule = Schema.Types.NumberType()
  .isInteger("Please enter valid price")
  .isRequired("Buying price is required")
  .min(50, "Price can't be below Ugx 50");

const sellingPriceRule = Schema.Types.NumberType()
  .isInteger("Please enter valid price")
  .isRequired("Buying price is required")
  .min(50, "Price can't be below Ugx 50");

const ManageStock = (props) => {
  const [tableData, setTableData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    buyingPrice: "",
    sellingPrice: "",
  });

  const [editFormData, setEditFormData] = useState({
    productName: "",
    buyingPrice: "",
    sellingPrice: "",
  });

  const handleChange = (formValue) => {
    setFormData(formValue);
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.productName ||
        !formData.buyingPrice ||
        formData.sellingPrice.trim() === ""
      ) {
        return;
      }

      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/stock/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: formData.productName,
            buyingPrice: formData.buyingPrice,
            sellingPrice: formData.sellingPrice,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });

        setFormData({
          productName: "",
          buyingPrice: "",
          sellingPrice: "",
        });

        setTableData((prevTableData) => [data, ...prevTableData]);
      } else {
        toast.error("Failed to save product details...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Failed to connect to the server...", {
        style: { backgroundColor: "#fcd0d0", color: "#333" },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/tdmis/api/v1/stock/products",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        toast.error("Failed to connect to the server...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    setEditingProductId(id);
    setDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tdmis/api/v1/stock/products/${editingProductId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted product from the data in the table
        const updatedData = tableData.filter(
          (product) => product.id !== editingProductId
        );
        setTableData(updatedData);
        setDeleteModal(false);
        toast.success("Product Deleted Successfully...", {
          style: { backgroundColor: "#cce6e8", color: "#333" },
        });
      } else {
        toast.error("Error deleting product. Please try again later.", {
          style: { backgroundColor: "#ff6666", color: "#333" },
        });
      }
    } catch (error) {
      toast.error("Error deleting product. Please try again later.", {
        style: { backgroundColor: "#ff6666", color: "#333" },
      });
    }
  };

  const handleEdit = (id) => {
    setEditingProductId(id);

    const productToEdit = tableData.find((product) => product.id === id);

    if (productToEdit) {
      setEditModal(true);
      setEditFormData({
        productName: productToEdit.product_name,
        buyingPrice: productToEdit.buying_price,
        sellingPrice: productToEdit.selling_price,
      });
    } else {
      console.error(`Product with id ${id} not found in tableData.`);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (
        !editFormData.sellingPrice ||
        !editFormData.buyingPrice ||
        editFormData.productName.trim() === ""
      ) {
        toast.error("Product name, buying and selling price are required...", {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
        return;
      }
      // Send a PUT request to the server with the updated user details
      const response = await fetch(
        "http://localhost:3002/tdmis/api/v1/stock/products",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: editingProductId,
            productName: editFormData.productName,
            buyingPrice: editFormData.buyingPrice,
            sellingPrice: editFormData.sellingPrice,
          }),
        }
      );
      const newData = await response.json();

      if (response.ok) {
        if (!newData || !newData.errors) {
          console.log("newData:", newData);

          const updatedData = tableData.map((product) =>
            product.id === editingProductId
              ? {
                  ...product,
                  product_name: newData.product_name,
                  buying_price: newData.buying_price,
                  selling_price: newData.selling_price,
                }
              : product
          );

          console.log("updatedData:", updatedData);

          setTableData(updatedData);
          setEditModal(false);
          toast.success("Product Details Changed Successfully...", {
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
        const error = newData.errors;

        // Display a toast for each error
        toast.error(`${error}`, {
          style: { backgroundColor: "#fcd0d0", color: "#333" },
        });
      }
    } catch (error) {
      console.error(error);
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
            <Grid fluid>
              <Row className="show-grid">
                <Col lg={6} xl={6} xxl={6}>
                  <Message
                    showIcon
                    type="info"
                    style={{ marginBottom: "15px" }}
                  >
                    Set up buying prices and products types for your dairy...
                  </Message>
                  <Panel bordered>
                    <Form
                      fluid
                      formValue={formData}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                    >
                      <Form.Group>
                        <Form.ControlLabel>Product Name</Form.ControlLabel>
                        <Form.Control
                          type="text"
                          name="productName"
                          value={formData.productName}
                          rule={productNameRule}
                        />
                        <Form.HelpText>
                          The is the name of the product you intend to stock
                        </Form.HelpText>
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel>
                          Buying Price (Ugx)
                        </Form.ControlLabel>
                        <Form.Control
                          type="number"
                          name="buyingPrice"
                          value={formData.buyingPrice}
                          rule={buyingPriceRule}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel>
                          Selling Price (Ugx)
                        </Form.ControlLabel>
                        <Form.Control
                          type="number"
                          name="sellingPrice"
                          value={formData.sellingPrice}
                          rule={sellingPriceRule}
                        />
                        <Form.HelpText>
                          This is the unit price customers pay
                        </Form.HelpText>
                      </Form.Group>
                      <ButtonToolbar>
                        <Button appearance="primary" type="submit">
                          Save
                        </Button>
                      </ButtonToolbar>
                    </Form>
                  </Panel>
                </Col>
                <Col>
                  <Panel bordered>
                    <Message
                      showIcon
                      type="subtle"
                      style={{ marginBottom: "15px" }}
                    >
                      <strong>
                        Showing all registered products in your store. This data
                        will be used when stocking and at the point of sale.
                      </strong>
                    </Message>
                    <Table data={tableData} autoHeight cellBordered fluid>
                      <Column width={200}>
                        <HeaderCell
                          style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                        >
                          Product Name
                        </HeaderCell>
                        <Cell dataKey="product_name" />
                      </Column>

                      <Column width={180}>
                        <HeaderCell
                          style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                        >
                          Buying Price (Ugx)
                        </HeaderCell>
                        <Cell dataKey="buying_price" />
                      </Column>

                      <Column width={180}>
                        <HeaderCell
                          style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                        >
                          Selling Price (Ugx)
                        </HeaderCell>
                        <Cell dataKey="selling_price" />
                      </Column>
                      <Column width={160} fixed="right">
                        <HeaderCell
                          style={{ fontSize: "1.0rem", fontWeight: "bold" }}
                        >
                          Action
                        </HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            const productId = rowData.id;
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <Button
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleEdit(productId)}
                                  appearance="link"
                                >
                                  Edit
                                </Button>
                                <Button
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(productId)}
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
                  </Panel>
                </Col>
              </Row>
            </Grid>
          </Content>

          {/* Start of delete modal */}
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
                <strong>Note: </strong>Deleting this product will delete all
                data related to this product, Continue with caution because this
                action is undoable...
              </Message>
              Are you sure you want to delete this product?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setDeleteModal(false)} appearance="subtle">
                Cancel
              </Button>
              <Button onClick={handleDeleteSubmit} appearance="primary">
                Yes, Delete Product
              </Button>
            </Modal.Footer>
          </Modal>
          {/* end of delete modal */}

          {/* Edit Modal */}
          <Modal open={editModal} onClose={() => setEditModal(false)} size="sm">
            <Modal.Header>
              <Modal.Title>Edit Product Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form fluid>
                <Form.Group>
                  <Form.Control
                    name="productName"
                    type="text"
                    value={editFormData.productName}
                    onChange={(value) =>
                      setEditFormData({ ...editFormData, productName: value })
                    }
                    placeholder="Product Name"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    name="buyingPrice"
                    type="text"
                    value={editFormData.buyingPrice}
                    onChange={(value) =>
                      setEditFormData({ ...editFormData, buyingPrice: value })
                    }
                    placeholder="Buying Price"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    name="sellingPrice"
                    type="text"
                    value={editFormData.sellingPrice}
                    onChange={(value) =>
                      setEditFormData({ ...editFormData, sellingPrice: value })
                    }
                    placeholder="Selling Price"
                  />
                </Form.Group>

                <div style={{ textAlign: "end" }}>
                  <Button
                    type="submit"
                    appearance="primary"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditModal(false)}
                    appearance="subtle"
                    style={{ margin: "0px 10px" }}
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
        </Container>
      </Container>
    </div>
  );
};

export default ManageStock;
