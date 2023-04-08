import {useEffect, useState} from "react";

import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {loadStripe} from "@stripe/stripe-js";
import "./stripe.css";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    fetch(`${endpoint}/config`).then(async (r) => {
      const {publishableKey} = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <div className="stripe-container">
      <h1>React Stripe and the Payment Element</h1>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
