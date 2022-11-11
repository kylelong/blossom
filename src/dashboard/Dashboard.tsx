import React from "react";
import Menu from "../landingPage/Menu";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import NavigationMenu from "./NavigationMenu";

import {
  DashboardContainer,
  LogoContainer,
  FlowerImage,
  HeaderContainer,
} from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <HeaderContainer>
        <LogoContainer>
          <Logo />
          <FlowerImage src={flower} />
        </LogoContainer>
        <Menu />
      </HeaderContainer>
      <NavigationMenu />
    </DashboardContainer>
  );
};

export default Dashboard;
