import React from "react";
import styled from "styled-components";
import {
  DashboardIcon,
  ImageIcon,
  CubeIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 10px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-right: 3px solid #f8f8f8;
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
  }
`;

const NavigationMenu: React.FC = () => {
  return (
    <NavigationContainer>
      <MenuContainer>
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
      </MenuContainer>
    </NavigationContainer>
  );
};

export default NavigationMenu;
