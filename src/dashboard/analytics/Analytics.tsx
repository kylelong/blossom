import React from "react";
import DashboardMenu from "../DashboardMenu";
import Menu from "../../landingPage/Menu";
import {
  DashboardContainer,
  DashboardSectionContainerCenter,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
  DashboardHeaderDetail,
} from "../dashboardStyles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"analytics"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>analytics</DashboardHeaderTextDesktop>
          <DashboardHeaderDetail>
            view your survey's analytics
          </DashboardHeaderDetail>
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Dashboard;
