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
  // const [surveyCount, setSurveyCount] = useState<number>(0);
  return (
    <DashboardContainer>
      <DashboardSectionContainer>
        <DashboardMenu headerText={"dashboard"} />
        <DashboardContent>
          <DashboardHeaderTextDesktop>dashboard</DashboardHeaderTextDesktop>
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
      </DashboardSectionContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
