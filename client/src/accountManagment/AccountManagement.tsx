import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ResetPassword from "../resetPassword/ResetPassword";
import VerifyEmail from "../verifyEmail/VerifyEmail";
import { auth } from "../firebase-config";
import { checkActionCode } from "firebase/auth";

// reset password & verify email
const AccountManagement: React.FC = () => {
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get("mode");
  const oobCode = new URLSearchParams(search).get("oobCode");
  // const apiKey= new URLSearchParams(search).get('apiKey');
  const [validCode, setValidCode] = useState(false);

  useEffect(() => {
    if (oobCode) {
      try {
        checkActionCode(auth, oobCode).then((response) => {
          setValidCode(true);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [oobCode]);

  // firebase auth for mode and oobCode
  if (oobCode) {
    if (mode === "resetPassword") {
      return <ResetPassword oobCode={oobCode} />;
    } else if ("verifyEmail") {
      return <VerifyEmail oobCode={oobCode} />;
    }
  }
  return <div>{!validCode && <p>Invalid authorization code</p>}</div>;
};

export default AccountManagement;
