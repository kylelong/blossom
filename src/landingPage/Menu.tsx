import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
      <Link to="/login" style={{ textDecoration: "none" }}>
        <MenuItem>Login</MenuItem>
      </Link>
      <Link to="/signup" style={{ textDecoration: "none" }}>
        <MenuItem>Sign up</MenuItem>
      </Link>
    </MenuContainer>
  );
};
export default Menu;
