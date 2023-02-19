import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {
  DashboardIcon,
  ImageIcon,
  CubeIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: unset;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -12px;
  border-right: 1.8px solid #f3f3f3;
  height: 100vh;
  width: 250px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuIcon = styled.span`
  margin-right: 3px;
  position: relative;
  top: 2px;
`;

const MenuItem = styled.div`
  disiplay: flex;
  flex-direction: row;
  font-size: 20px;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px transparent solid;
  text-align: left;
  font-weight: bold;
  color: #525f7f;
  &:hover {
    background-color: #fa5f55;
    border: 1px white solid;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    padding: 10px;
    font-weight: bold;
  }
`;

const linkStyle = {
  textDecoration: "none",
  color: "black",
};

const NavigationMenu: React.FC = () => {
  return (
    <NavigationContainer>
      <MenuContainer>
        <LogoContainer>
          <Logo />
          <FlowerImage src={flower} />
        </LogoContainer>
        <Link to="/dashboard" style={linkStyle}>
          <MenuItem>
            <MenuIcon>
              <DashboardIcon />
            </MenuIcon>
            dashboard
          </MenuItem>
        </Link>
        <Link to="/create" style={linkStyle}>
          <MenuItem>
            <MenuIcon>
              <ImageIcon />
            </MenuIcon>
            create
          </MenuItem>
        </Link>
        <Link to="/surveys" style={linkStyle}>
          <MenuItem>
            <MenuIcon>
              <Pencil2Icon />
            </MenuIcon>
            surveys
          </MenuItem>
        </Link>
        <Link to="/analytics" style={linkStyle}>
          <MenuItem>
            <MenuIcon>
              <CubeIcon />
            </MenuIcon>
            analytics
          </MenuItem>
        </Link>
      </MenuContainer>
    </NavigationContainer>
  );
};

export default NavigationMenu;
