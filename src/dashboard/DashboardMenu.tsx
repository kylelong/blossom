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

interface Props {
  headerText?: string;
}

const DashboardMenu: React.FC<Props> = ({ headerText }) => {
  return (
    <>
      <NavigationMenu />
      <HeaderContainer>
        <LogoContainer>
          <SubLogoContainer>
            <Logo mobile={true} />
            <FlowerImage src={flower} />
          </SubLogoContainer>
          <DashboardHeaderText>{headerText}</DashboardHeaderText>
        </LogoContainer>

        <MobileNavigationMenu />
      </HeaderContainer>
    </>
  );
};

export default DashboardMenu;
