import React, { useState } from "react";
import NavBar from "./NavBar";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

function AddProduct() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [btnLading, setBtnLoading] = useState(false);

  const handleAddProduct = async () => {
    try {
      if (!name || !image || !price) {
        return toast.warn("All fields are required.");
      }
      setBtnLoading(true);
      let res = await axios.post("https://trydol-task-server.vercel.app/api/product/add", {
        name,
        image,
        price,
      });

      let { status, message, data: apiData } = res.data || res;
      if (status) {
        toast.success(message);
        setName("");
        setImage("");
        setPrice("");
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div>
      <NavBar />
      <Container>
        <h1 className="mt-3 text-center">Add Product</h1>
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
              type="text"
              placeholder="Product Name"
            />
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mb-2"
              type="text"
              placeholder="Product Image URI"
            />
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mb-2"
              type="text"
              placeholder="Product Price"
            />
            <Button onClick={handleAddProduct} variant="primary">
              Add Product
            </Button>
          </Col>
          <Col md={2}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default AddProduct;
