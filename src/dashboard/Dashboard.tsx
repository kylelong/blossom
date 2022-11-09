import React from "react";
import Menu from "../landingPage/Menu";
import Logo from "../Logo";
import flower from "../scandi-373.svg";

import {
  DashboardContainer,
  LogoContainer,
  FlowerImage,
  Header,
} from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Header>
        <LogoContainer>
          <Logo />
          <FlowerImage src={flower} />
        </LogoContainer>
        <Menu />
      </Header>
    </DashboardContainer>
  );
};

export default Dashboard;
