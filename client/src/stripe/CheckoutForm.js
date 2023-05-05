import {useState, useEffect} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import stripeLogo from "../images/stripe-cropped.svg";
import axios from "axios";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

export default function CheckoutForm({email}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [trialData, setTriaData] = useState({
    msg: "",
    access: false,
    premium: false,
  });
  const [loaded, setLoaded] = useState(false);

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
  useEffect(() => {
    const getTrialMessage = async () => {
      const response = await axios.get(`${endpoint}/trial_info`);
      setTriaData(response.data);
    };
    getTrialMessage();
    setLoaded(true);
  }, []);
  if (succeeded) {
    // set premium to true with axios call for this user with id, authenticated route
    return (
      <div className="subscribe-message">
        Congratulations. You are now subscribed and can continue using Blossom.
        Thank you 😊
      </div>
    );
  }

  return (
    <div className="stripe-container">
      <div className="trail-container">
        <div className="trail-message">{trialData.msg}</div>
        {!trialData.premium && (
          <>
            {" "}
            <div className="trail-message">
              Become a premium user to continue using Blossom.
            </div>
            <div className="trail-message">
              Billed Monthly at $25 / mo. Cancel or Pause anytime.
            </div>
          </>
        )}
      </div>
      {!trialData.premium && (
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
                // <div className="spinner" id="spinner"></div>
                <div>Processing...</div>
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
          <a href="https://stripe.com/" target="_blank" rel="noreferrer">
            {" "}
            <img
              src={stripeLogo}
              alt="powered by stripe"
              className="stripeLogo"
            />
          </a>
        </form>
      )}
    </div>
  );
}
