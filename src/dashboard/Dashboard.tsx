import React from "react";
import NavigationMenu from "./NavigationMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";

import {
  DashboardContainer,
  HeaderContainer,
  DashboardHeaderText,
} from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <NavigationMenu />
      <HeaderContainer>
        <MobileNavigationMenu />
        <DashboardHeaderText>dashboard</DashboardHeaderText>
      </HeaderContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
