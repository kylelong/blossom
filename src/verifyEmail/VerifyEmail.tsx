import React, { useEffect, useState } from "react";
import { auth, app } from "../firebase-config";
import { applyActionCode } from "firebase/auth";
import Logo from "../Logo";
import flower from "../scandi-373.svg";
import {
  VerifyEmailContainer,
  LogoContainer,
  FlowerImage,
  VerifiedMessaged,
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

const db = getFirestore(app);

interface Props {
  oobCode: string;
}

const VerifyEmail: React.FC<Props> = ({ oobCode }) => {
  const [verified, setVerified] = useState<boolean>(false);

  const updateConfirmed = async (uid: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((document) => {
      const docRef = doc(db, "users", document.id);
      console.log(document.data(), document.id);
      updateDoc(docRef, {
        confirmed: true,
      });
    });
  };

  const verifyEmail = async () => {
    await applyActionCode(auth, oobCode)
      .then((response) => {
        console.log("success");
        if (auth.currentUser) {
          updateConfirmed(auth.currentUser.uid);
          auth.currentUser.reload().then((response) => {
            setVerified(true);
            if (auth.currentUser) {
              console.log(auth.currentUser.emailVerified);
            }
          });
        }

        auth.onAuthStateChanged((user) => {
          if (user) {
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
