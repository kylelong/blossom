import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
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
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
      setLoading(false);
    } else {
      setLoggedIn(false);
      setLoading(false);
    }
  });
  const menuToShow = () => {
    if (loading) {
      return <div></div>;
    } else {
      if (loggedIn) {
        return (
          <MenuContainer>
            <MenuItem
              onClick={() => {
                auth.signOut();
              }}
            >
              sign out
            </MenuItem>
            <MenuItem>account</MenuItem>
          </MenuContainer>
        );
      } else {
        return (
          <MenuContainer>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <MenuItem>login</MenuItem>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <MenuItem>sign up</MenuItem>
            </Link>
          </MenuContainer>
        );
      }
    }
  };
  return <>{menuToShow()}</>;
};
export default Menu;
