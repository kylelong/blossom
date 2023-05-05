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
    <>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm email={email} />
        </Elements>
      )}
    </>
  );
}

export default Payment;
