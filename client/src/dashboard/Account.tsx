import React, {useEffect, useState, useCallback} from "react";
import DashboardMenu from "./DashboardMenu";
import axios from "axios";
import {auth, app} from "../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import {getFirestore, doc, updateDoc} from "firebase/firestore";
import {useForm, SubmitHandler} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import {
  DashboardContainer,
  DashboardSectionContainerCenter,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
} from "./dashboardStyles";
import "./account.css";
import User from "./types";
import Menu from "../landingPage/Menu";

type accountData = {
  company: string;
};
axios.defaults.withCredentials = true;

const Account = () => {
  const [user] = useAuthState(auth);
  const db = getFirestore(app);
  const endpoint =
    process.env.REACT_APP_NODE_ENV === "production"
      ? process.env.REACT_APP_LIVE_SERVER_URL
      : process.env.REACT_APP_LOCALHOST_URL;

  const [userData, setUserData] = useState<User | undefined>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const {register, handleSubmit} = useForm<accountData>({
    defaultValues: {
      company: "",
    },
  });
  const onSubmit: SubmitHandler<accountData> = (data) =>
    updateCompany(data.company);

  const updateCompany = async (company: string) => {
    try {
      const response = await axios.put(`${endpoint}/update_company`, {
        company: company,
      });
      const data = await response.data;
      if (userData !== undefined) {
        let currentUserData: User = userData;
        currentUserData.company = data;
        setUserData(currentUserData);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    // firebase
    if (user && company) {
      const userDoc = doc(db, "users", user.uid);
      try {
        await updateDoc(userDoc, {
          company: company,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const userInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${endpoint}/user_info`);
      const data = await response.data;
      setUserData(data);
    } catch (err: any) {
      console.error(err.message);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!loaded) {
      userInfo();
      setLoaded(true);
    }
  }, [userInfo, loaded]);

  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"account"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>account</DashboardHeaderTextDesktop>
          <div className="accountContainer">
            <div className="accountLabel">
              Email: <span className="accountField">{userData?.email}</span>
            </div>
            <form
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                alignItems: "start",
                flexDirection: "column",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Label.Root className="LabelRoot" htmlFor="firstName">
                Company: <span>{userData?.company}</span>
              </Label.Root>
              <input
                {...register("company")}
                className="Input"
                type="text"
                name="company"
                id="contact"
              />

              <button
                className="updateBtn"
                type="submit"
                onClick={() => userInfo()}
              >
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
