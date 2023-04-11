import React, {useEffect, useState} from "react";
import {auth, app} from "../firebase-config";
import {applyActionCode} from "firebase/auth";
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

interface Props {
  oobCode: string;
}

const VerifyEmail: React.FC<Props> = ({oobCode}) => {
  const [verified, setVerified] = useState<boolean>(false);

  // TODO: set postgres user.confirmed = true, set confirm for postgres
  /**
   * axios.put(`${endpoint}/confirm_user`)
   */
  const updateConfirmed = async (uid: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((document) => {
      const docRef = doc(db, "users", document.id);
      updateDoc(docRef, {
        confirmed: true,
      });
    });
  };

  useEffect(() => {
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
