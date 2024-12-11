import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Container, Button, ListGroup, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Cart() {
  const cartItems = useSelector((state) => state.cart);
  const [totalPriceN, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true); // To check if email is valid


  useEffect(()=>{
    if(cartItems.length>0){
      setTotalPrice(calculateTotal())
    }
  },[cartItems])

  // Function to calculate total price
  const calculateTotal = () => {
    let totalPrice = 0;
    cartItems.forEach((element) => {
      totalPrice =
        totalPrice + parseInt(element.price) * parseInt(element.quantity);
    });
    return totalPrice;
  };

  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (!email) {
      setIsEmailValid(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/create/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: totalPriceN,
          products: cartItems,
        }),
      });
      const data = await response.json();
      console.log(data);
      // Navigate to the checkout page after order is created
      navigate("/pay/checkout",{
        state: {
          orderData:{
            id: data.data._id,
            email,
            amount: totalPriceN,
            products: cartItems
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceedToCheckout = () => {
    setShowModal(true); // Show modal to enter email
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h2>Shopping Cart</h2>
        {cartItems && cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ListGroup className="mt-2">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <strong>{item.name}</strong> - ₹{item.price} * {item.quantity}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex justify-content-between mt-3">
              <h4>Total: ₹{totalPriceN}</h4>
              <Button onClick={handleProceedToCheckout} variant="primary">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </Container>

      {/* Modal for entering email */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Email for Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!isEmailValid}
              />
              {!isEmailValid && (
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateOrder}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;
