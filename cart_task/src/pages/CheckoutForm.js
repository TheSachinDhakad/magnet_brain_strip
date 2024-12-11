import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, Button, Alert, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ mEmail, Mid, amount }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(mEmail);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:4001/create-payment-intent", {
        amount: amount * 100,
        currency: "inr",
      })
      .then((response) => setClientSecret(response.data.clientSecret))
      .catch((error) => console.error("Error fetching client secret:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe is not loaded properly.");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email,
          },
        },
      }
    );

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      let { id, amount, status } = paymentIntent;
      axios
        .post("http://localhost:4001/update/order", {
          id: Mid,
          payId: id,
          amount,
          status,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.status) {
            navigate("/checkout");
            setSuccess(true);
          } else {
            setError("Payment failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error updating order:", error);
        });
      //   setSuccess(true);
    } else {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          width: "30rem",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-4">Checkout</Card.Title>
          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                disabled
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Card Element */}
            <Form.Group className="mb-3">
              <Form.Label>Card Details</Form.Label>
              <CardElement className="form-control" />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={!stripe || !clientSecret}
              className="w-100"
            >
              Pay
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mt-3">
              Payment successful!
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CheckoutForm;
