import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Alert, Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartReducer";
import { FaCheckCircle } from "react-icons/fa"; // Optional icon

function Checkout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container className="text-center">
          <Row>
            <Col>
              <div className="d-flex justify-content-center mb-4">
                <FaCheckCircle size={100} color="#28a745" />
              </div>
              <Alert
                variant="success"
                className="p-4 text-center"
                style={{
                  fontSize: "1.25rem",
                  backgroundColor: "#d4edda",
                  borderColor: "#c3e6cb",
                }}
              >
                <strong>Thank you for your order!</strong>
                <br />
                Your payment has been processed successfully. We will notify you
                once your items are shipped.
              </Alert>
              <div>
                <Button href="/" variant="primary" size="lg" className="mt-4">
                  Go to Homepage
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Checkout;
