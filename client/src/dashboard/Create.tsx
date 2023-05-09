import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import Panel from "./create/Panel";
import {
  DashboardContainer,
  DashboardSectionContainerCenter,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
  DashboardHeaderDetail,
} from "./dashboardStyles";

const Create = () => {
  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"create"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>create</DashboardHeaderTextDesktop>
          <DashboardHeaderDetail>create a new survey</DashboardHeaderDetail>
          <Panel />
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Create;
