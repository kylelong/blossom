import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import Panel from "./create/Panel";
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
        <DashboardMenu headerText={"create"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>create</DashboardHeaderTextDesktop>
          <div>This is a dashboard for your surveys asdfasdfasdf</div>
          <Panel />
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
