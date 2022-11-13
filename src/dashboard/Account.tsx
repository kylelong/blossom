import React, { useEffect, useState } from "react";
import DashboardMenu from "./DashboardMenu";
import { auth, app } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  DashboardContainer,
  DashboardSectionContainer,
  DashboardContent,
  DashboardHeaderTextDesktop,
} from "./styles";
import User from "./types";
import Menu from "../landingPage/Menu";

const Account = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<User | null>(null);
  const db = getFirestore(app);
  const userInfo = async () => {
    if (user?.uid) {
      const userDoc = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDoc);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as User);
      } else {
        console.log("no document");
      }
    }
  };

  useEffect(() => {
    userInfo();
  }, [user]);

  return (
    <DashboardContainer>
      <DashboardSectionContainer>
        <DashboardMenu headerText={"account"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>account</DashboardHeaderTextDesktop>
          <div>This is a dashboard for your surveys asdfasdfasdf</div>
        </DashboardContent>
        <Menu />
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Account;
