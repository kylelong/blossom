import React, { useEffect, useState } from "react";
import DashboardMenu from "./DashboardMenu";
import { auth, app } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import * as Label from "@radix-ui/react-label";
import {
  DashboardContainer,
  DashboardSectionContainer,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
} from "./styles";
import "./analytics.css";
import User from "./types";
import Menu from "../landingPage/Menu";
const CompanyForm = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 15,
        alignItems: "start",
        flexDirection: "row",
      }}
    >
      <Label.Root className="LabelRoot" htmlFor="firstName">
        Company:
      </Label.Root>
      <input className="Input" type="text" id="contact" placeholder="Google" />
    </div>
  );
};

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
          <div className="accountContainer">
            <div className="accountLabel">
              Email: <span className="accountField">{user?.email}</span>
            </div>
            {CompanyForm()}
            <button className="updateBtn">Update</button>
          </div>
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Account;
