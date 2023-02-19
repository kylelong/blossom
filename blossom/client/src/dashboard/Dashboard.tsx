import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
import DashboardOverview from "./DashboardOverview";
import {
  DashboardContainer,
  DashboardContent,
  DashboardHeaderTextDesktop,
  MenuContainer,
  DashboardSectionContainerCenter,
  DashboardHeaderDetail,
} from "./dashboardStyles";

const Dashboard = () => {
  // const [surveyCount, setSurveyCount] = useState<number>(0);
  return (
    <DashboardContainer>
      <DashboardSectionContainerCenter>
        <DashboardMenu headerText={"dashboard"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>dashboard</DashboardHeaderTextDesktop>
          <DashboardHeaderDetail>
            view details about your surveys
          </DashboardHeaderDetail>
          <DashboardOverview />
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Dashboard;
