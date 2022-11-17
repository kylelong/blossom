import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import {
  DashboardContainer,
  DashboardSectionContainer,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
} from "./dashboardStyles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardSectionContainer>
        <DashboardMenu headerText={"analytics"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>analytics</DashboardHeaderTextDesktop>
          <div>This is a dashboard for your surveys asdfasdfasdf</div>
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
