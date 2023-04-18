import React, {useEffect, useState} from "react";
import {auth, app} from "../firebase-config";
import {applyActionCode} from "firebase/auth";
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
import {
  query,
  where,
  getFirestore,
  doc,
  getDocs,
  updateDoc,
  collection,
} from "firebase/firestore";
import {Link} from "react-router-dom";
//import axios from "axios";

const db = getFirestore(app);
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

interface Props {
  oobCode: string;
}

const VerifyEmail: React.FC<Props> = ({oobCode}) => {
  const [verified, setVerified] = useState<boolean>(false);

  const confirmPostgres = async (hash: string) => {
    await axios.put(`${endpoint}/confirm_user`, {
      hash: hash,
    });
  };

  useEffect(() => {
    const updateConfirmed = async (uid: string) => {
      confirmPostgres(uid);
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapShot = await getDocs(q);
      querySnapShot.forEach((document) => {
        const docRef = doc(db, "users", document.id);
        updateDoc(docRef, {
          confirmed: true,
        });
      });
    };
    const verifyEmail = async () => {
      await applyActionCode(auth, oobCode)
        .then((response) => {
          if (auth.currentUser) {
            updateConfirmed(auth.currentUser.uid);
            auth.currentUser.reload().then((response) => {
              setVerified(true);
              if (auth.currentUser) {
                console.log(auth.currentUser.emailVerified);
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    verifyEmail();
  }, [oobCode]);

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
