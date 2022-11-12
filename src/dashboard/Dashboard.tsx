import React from "react";
import NavigationMenu from "./NavigationMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";

import {
  DashboardContainer,
  HeaderContainer,
  DashboardHeaderText,
  LogoContainer,
  FlowerImage,
  SubLogoContainer,
} from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <NavigationMenu />
      <HeaderContainer>
        <LogoContainer>
          <SubLogoContainer>
            <Logo mobile={true} />
            <FlowerImage src={flower} />
          </SubLogoContainer>
          <DashboardHeaderText>create</DashboardHeaderText>
        </LogoContainer>

        <MobileNavigationMenu />
      </HeaderContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
