import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Card,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, removeProduct } from "../redux/cartReducer";
import NavBar from "./NavBar";
function Home() {
  const [products, setAllProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const dispatch = useDispatch();

  const storeProduct = useSelector((state) => state.cart);

  const handleAdd = (item) => {
    dispatch(addProduct({ ...item, accessKey: products.length }));
  };

  const handleRemove = (item) => {
    dispatch(removeProduct({ ...item, accessKey: products.length }));
  };

  const fetAllProducts = async () => {
    try {
      setDataLoading(true);
      let res = await axios.get("https://trydol-task-server.vercel.app/api/products");
      let { status, message, data: apiData } = res.data || res;
      if (status) {
        setAllProducts(apiData);
      } else {
        toast.error(message || "Server Error Please try again later.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetAllProducts();
  }, []);

  return (
    <div>
      <NavBar />
      <Container className="mt-4">
        <Row>
          {!dataLoading &&
            products &&
            products.length > 0 &&
            products.map((item, index) => (
              <Col key={index} md={3}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={item.image || "https://via.placeholder.com/500x300"}
                    alt="Card image"
                  />
                  <Card.Body>
                    <Card.Title>
                      {item.name || "Title Not Available."}
                    </Card.Title>
                    <Card.Text>
                      <b>Price:</b> ₹{item.price}
                    </Card.Text>
                    <Button
                      onClick={() => handleAdd(item)}
                      size="sm"
                      variant="primary"
                    >
                      Add To Cart
                    </Button>
                    <Button
                      onClick={() => handleRemove(item)}
                      className="ms-2"
                      size="sm"
                      variant="danger"
                    >
                      Remove To Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          {dataLoading && <Spinner />}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
