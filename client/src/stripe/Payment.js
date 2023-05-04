import React, {useEffect, useState} from "react";

import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {loadStripe} from "@stripe/stripe-js";
import "./stripe.css";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

function Payment({email}) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    fetch(`${endpoint}/config`).then(async (r) => {
      const {publishableKey} = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <div className="stripe-container">
      <h5>Your 2 week free trial will end in 10 days.</h5>
      <h5>Become a premium user to continue using Blossom.</h5>
      <h5>Billed Monthly at $25 / mo. Cancel or Pause anytime.</h5>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm email={email} />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
