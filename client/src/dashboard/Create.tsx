import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import Panel from "./create/Panel";
import SuggestionBox from "./create/SuggestionBox";
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
          <SuggestionBox />
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Create;
