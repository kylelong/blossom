import React, {useEffect, useState} from "react";
import axios from "axios";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import {
  VerifyEmailContainer,
  LogoContainer,
  FlowerImage,
  VerifiedMessaged,
  linkStyle,
  LoginButton,
} from "./styles";

import {Link} from "react-router-dom";

const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

interface Props {
  hash: string;
}

const VerifyEmail: React.FC<Props> = ({hash}) => {
  const [verified, setVerified] = useState<boolean>(false);

  const confirmPostgres = async (hash: string) => {
    axios
      .put(`${endpoint}/confirm_user`, {
        hash: hash,
      })
      .then((response) => {
        setVerified(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    confirmPostgres(hash);
  }, [hash, verified]);

  return (
    <VerifyEmailContainer>
      <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
      </LogoContainer>
      {verified && (
        <>
          <VerifiedMessaged>Your email has been verified.</VerifiedMessaged>
          <Link to="/login" style={linkStyle}>
            {" "}
            <LoginButton>Login</LoginButton>
          </Link>
        </>
      )}
    </VerifyEmailContainer>
  );
};

export default VerifyEmail;
