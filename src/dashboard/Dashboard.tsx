import React from "react";
import DashboardMenu from "./DashboardMenu";
import Menu from "../landingPage/Menu";
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
            view information about your surveys
          </DashboardHeaderDetail>
          {/* {surveyCount === 0 && (
            <div>
              Click here to create a survey. Once you create surveys you will
              see metrics here. This is dummy text
            </div>
          )} */}
        </DashboardContent>
        <MenuContainer>
          <Menu />
        </MenuContainer>
      </DashboardSectionContainerCenter>
    </DashboardContainer>
  );
};

export default Dashboard;
