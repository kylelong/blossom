import React from "react";
import { auth } from "../firebase-config";
import styled from "styled-components";
import {
  DashboardIcon,
  ImageIcon,
  CubeIcon,
  Pencil2Icon,
  ExitIcon,
  GearIcon,
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
  width: 200px;
  @media (max-width: 630px) {
    width: unset;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -12px;
  border-right: 1.8px solid #f3f3f3;
  height: 100vh;
  @media (max-width: 630px) {
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

const NavigationMenu: React.FC = () => {
  return (
    <NavigationContainer>
      <MenuContainer>
        <LogoContainer>
          <Logo />
          <FlowerImage src={flower} />
        </LogoContainer>
        <MenuItem>
          <MenuIcon>
            <DashboardIcon />
          </MenuIcon>
          dashboard
        </MenuItem>
        <MenuItem>
          <MenuIcon>
            <ImageIcon />
          </MenuIcon>
          create
        </MenuItem>
        <MenuItem>
          <MenuIcon>
            <Pencil2Icon />
          </MenuIcon>
          surveys
        </MenuItem>
        <MenuItem>
          <MenuIcon>
            <CubeIcon />
          </MenuIcon>
          analytics
        </MenuItem>
        <MenuItem>
          <MenuIcon>
            <GearIcon />
          </MenuIcon>
          account
        </MenuItem>
        <MenuItem
          onClick={() => {
            auth.signOut();
          }}
        >
          <MenuIcon>
            <ExitIcon />
          </MenuIcon>
          sign out
        </MenuItem>
      </MenuContainer>
    </NavigationContainer>
  );
};

export default NavigationMenu;
