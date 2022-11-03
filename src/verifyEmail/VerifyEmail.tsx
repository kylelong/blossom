import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { applyActionCode } from "firebase/auth";
import Logo from "../Logo";
import flower from "../scandi-373.svg";
import {
  VerifyEmailContainer,
  LogoContainer,
  FlowerImage,
  VerifiedMessaged,
} from "./styles";

interface Props {
  oobCode: string;
}

const VerifyEmail: React.FC<Props> = ({ oobCode }) => {
  const [verified, setVerified] = useState<boolean>(false);

  const verifyEmail = async () => {
    await applyActionCode(auth, oobCode)
      .then((response) => {
        console.log("success");
        if (auth.currentUser) {
          console.log("email verified: ", auth.currentUser.emailVerified);
          auth.currentUser.reload().then((response) => {
            setVerified(true);
          });
        }

        auth.onAuthStateChanged((user) => {
          if (user) {
            console.log(user);
            console.log("SIGNED IN!!");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    verifyEmail();
  });

  return (
    <VerifyEmailContainer>
      <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
      </LogoContainer>
      {verified && (
        <VerifiedMessaged>Your email has been verified.</VerifiedMessaged>
      )}
    </VerifyEmailContainer>
  );
};

export default VerifyEmail;
