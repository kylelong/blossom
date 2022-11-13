import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import {
  DashboardContainer,
  DashboardSectionContainer,
  DashboardContent,
  DashboardHeaderTextDesktop,
} from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardSectionContainer>
        <DashboardMenu headerText={"surveys"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>surveys</DashboardHeaderTextDesktop>
          <div>This is a dashboard for your surveys asdfasdfasdf</div>
        </DashboardContent>
        <Menu />
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
