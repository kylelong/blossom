import React, {useEffect, useState, useCallback} from "react";
import DashboardMenu from "./DashboardMenu";
import {auth, app} from "../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import {useForm} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import {
  DashboardContainer,
  DashboardSectionContainerCenter,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
} from "./dashboardStyles";
import "./account.css";
// import User from "./types";
import Menu from "../landingPage/Menu";

type accountData = {
  company: string;
};

const Account = () => {
  const [user] = useAuthState(auth);
  const db = getFirestore(app);

  // const [userData, setUserData] = useState<User | null>(null);
  // from firebase
  const [currentCompany, setCurrentCompany] = useState<string | undefined>("");
  const {register, handleSubmit} = useForm<accountData>({
    defaultValues: {
      company: "",
    },
  });

  const updateCompany = async (company: string) => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      try {
        await updateDoc(userDoc, {
          company: company,
        });
        setCurrentCompany(company);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const userInfo = useCallback(async () => {
    if (user?.uid) {
      const userDoc = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDoc);

      if (userDocSnap.exists()) {
        // setUserData(userDocSnap.data() as User);
        setCurrentCompany(userDocSnap.data().company);
      } else {
        console.log("no document");
      }
    }
  }, [db, user?.uid]);

  useEffect(() => {
    userInfo();
  }, [userInfo]);

  const onSubmit = handleSubmit(({company}) => {
    updateCompany(company);
  });

  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"account"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>account</DashboardHeaderTextDesktop>
          <div className="accountContainer">
            <div className="accountLabel">
              Email: <span className="accountField">{user?.email}</span>
            </div>
            <form
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                alignItems: "start",
                flexDirection: "column",
              }}
              onSubmit={onSubmit}
            >
              <Label.Root className="LabelRoot" htmlFor="firstName">
                Company: <span>{currentCompany}</span>
              </Label.Root>
              <input
                {...register("company")}
                className="Input"
                type="text"
                name="company"
                id="contact"
              />

              <button className="updateBtn" type="submit">
                Update
              </button>
            </form>
          </div>
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Account;
