import {CardElement} from "@stripe/react-stripe-js";
import {useState} from "react";
import {useStripe, useElements} from "@stripe/react-stripe-js";
const endpoint = process.env.REACT_APP_LOCALHOST_URL;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const priceId = "price_1M6QudHadwp6AsWci1if6CyF";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = "videogameman12@yahoo.com";
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
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
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod?.paymentMethod?.id,
          email: email,
          priceId: priceId,
        }),
      }).then((r) => r.json());

      const confirmPayment = await stripe.confirmCardPayment(
        response.clientSecret,
        {
          return_url: `${window.location.origin}/completion`,
        }
      );
      if (confirmPayment.error) {
        setMessage(confirmPayment.error.message);
        console.log(confirmPayment.error.message);
      } else {
        setMessage("Payment succeeded. Thank you :)");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An unexpected error occured. " + err.message);
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" />
      <button
        className="payment-button"
        disabled={isProcessing || !stripe || !elements}
        id="submit"
      >
        <div className="spinner hidden" id="spinner"></div>
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Subscribe"}
        </span>
      </button>
      <p id="card-error" role="alert"></p>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
