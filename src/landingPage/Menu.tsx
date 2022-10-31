import React from "react";
import styled from "styled-components";

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`;

export const MenuItem = styled.div`
  display: flex;
  margin-right: 15px;
  font-weight: bold;
  color: #355e3b;
  &:hover {
    color: #fa5f55;
    cursor: pointer;
  }
`;

const Menu: React.FC = () => {
  return (
    <MenuContainer>
      <MenuItem>Benefits</MenuItem>
      <MenuItem>FAQs</MenuItem>
      <MenuItem>Pricing</MenuItem>
      <MenuItem>Login</MenuItem>
    </MenuContainer>
  );
};
export default Menu;
