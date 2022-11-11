import React from "react";
import Menu from "../landingPage/Menu";
import NavigationMenu from "./NavigationMenu";

import { DashboardContainer, HeaderContainer } from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <NavigationMenu />
      <HeaderContainer>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          {" "}
          dashboard
        </div>
        <Menu />
      </HeaderContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
