import {useState} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const priceId =
    process.env.REACT_APP_NODE_ENV === "production"
      ? process.env.REACT_APP_LIVE_PRICE_ID
      : process.env.REACT_APP_TEST_PRICE_ID;

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const email = "kylel95@vt.edu";
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement),
        billing_details: {
          email: email,
        },
      });

      const response = await fetch(`${endpoint}/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.REACT_APP_NODE_ENV === "production"
              ? process.env.REACT_APP_LIVE_URL
              : process.env.REACT_APP_LOCAL_URL,
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod?.paymentMethod?.id,
          email: email,
          priceId: priceId,
        }),
      })
        .then((r) => {
          return r.json();
        })
        .catch((err) => {
          setError(`Payment failed ${err.message}`);
        });
      if (response && response.raw) {
        setError(response.raw.message + " Please try again.");
      }

      const confirmPayment = await stripe.confirmCardPayment(
        response.clientSecret,
        {
          receipt_email: email,
        }
      );
      if (confirmPayment.error) {
        setMessage(confirmPayment.error.message);
        setError(`Payment failed ${confirmPayment.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        setMessage("Payment succeeded. Thank you 😊");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("Payment failed. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        className="payment-button"
        style={{opacity: disabled ? "0.5" : "1"}}
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Subscribe"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show any error or success messages */}
      {!error && message && <div id="payment-message">{message}</div>}
    </form>
  );
}
