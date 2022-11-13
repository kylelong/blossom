import React from "react";
import NavigationMenu from "./NavigationMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";

import {
  DashboardMenuContainer,
  HeaderContainer,
  DashboardHeaderText,
  LogoContainer,
  FlowerImage,
  SubLogoContainer,
} from "./styles";

interface Props {
  headerText?: string;
}

const DashboardMenu: React.FC<Props> = ({ headerText }) => {
  return (
    <DashboardMenuContainer>
      <NavigationMenu />
      <HeaderContainer>
        <LogoContainer>
          <SubLogoContainer>
            <Logo mobile={true} />
            <FlowerImage src={flower} />
            <DashboardHeaderText>{headerText}</DashboardHeaderText>
          </SubLogoContainer>
        </LogoContainer>

        <MobileNavigationMenu />
      </HeaderContainer>
    </DashboardMenuContainer>
  );
};

export default DashboardMenu;
