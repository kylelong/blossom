import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import {
  DashboardContainer,
  DashboardSectionContainerCenter,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
} from "./dashboardStyles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"surveys"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>surveys</DashboardHeaderTextDesktop>
          <div>This is a dashboard for your surveys asdfasdfasdf</div>
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Dashboard;
