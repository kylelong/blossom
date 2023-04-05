import {useEffect, useState} from "react";

import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {loadStripe} from "@stripe/stripe-js";
import "./stripe.css";
const endpoint = process.env.REACT_APP_LOCALHOST_URL;

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    fetch(`${endpoint}/config`).then(async (r) => {
      const {publishableKey} = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
