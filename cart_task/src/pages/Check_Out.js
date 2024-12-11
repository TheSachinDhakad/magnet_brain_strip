import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";

// Load your publishable key
const stripePromise = loadStripe(
  "pk_test_51QUjXyG6mLPtdIeHtjRqK12P3XmXFildsPWZCjcGiZn9NPWKuopEjYq9FVyZqG2hUmFBwadmPiAAkk0myOkuRBeo00NzmzDRAs"
);

const Check_Out = () => {
  const location = useLocation();
  const { orderData } = location.state || {};
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm mEmail={orderData?.email} Mid={orderData?.id} amount={orderData?.amount} />
    </Elements>
  );
};

export default Check_Out;
