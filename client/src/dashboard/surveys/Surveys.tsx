import React from "react";
import DashboardMenu from "../DashboardMenu";
import Menu from "../../landingPage/Menu";
import SurveysList from "./SurveysList";
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
        <DashboardMenu headerText={"surveys"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>surveys</DashboardHeaderTextDesktop>
          <DashboardHeaderDetail>
            view the surveys you've created
          </DashboardHeaderDetail>
          <SurveysList />
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Dashboard;
