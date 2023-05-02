import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import ResetPassword from "../resetPassword/ResetPassword";
import VerifyEmail from "../verifyEmail/VerifyEmail";
import axios from "axios";

const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

// reset password & verify email
const AccountManagement: React.FC = () => {
  const {search} = useLocation();
  const mode = new URLSearchParams(search).get("mode");
  const hash = new URLSearchParams(search).get("hash");
  // const apiKey= new URLSearchParams(search).get('apiKey');
  const [validCode, setValidCode] = useState(false);

  useEffect(() => {
    const validateHash = async () => {
      try {
        const response = await axios.get(`${endpoint}/valid_hash/${hash}`);
        if (parseInt(response.data.count) === 1) {
          setValidCode(true);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    };

    if (hash && !validCode) {
      validateHash();
    }
  }, [hash, validCode]);

  // firebase auth for mode and hash
  if (hash) {
    if (mode === "resetPassword") {
      return <ResetPassword hash={hash} />;
    } else if (mode === "verifyEmail") {
      return <VerifyEmail hash={hash} />;
    }
  }
  return (
    <div>
      {!validCode && (
        <p>
          There was an error. Please try again or contact
          contact@blossomsurveys.io
        </p>
      )}
    </div>
  );
};

export default AccountManagement;
